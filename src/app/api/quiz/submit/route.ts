import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculatePersonalityType, type PersonalityType } from '@/lib/scoring';

// Dynamic scoring using form's scoring config from DB
function calculateFromFormScoring(
  answers: Record<string, string>,
  questions: { questionKey: string; scoringWeight: number; scoringMap: string | null }[]
): { type: PersonalityType; scores: Record<PersonalityType, number> } {
  const scores: Record<PersonalityType, number> = {
    emotional_trader: 0,
    time_starved_trader: 0,
    inconsistent_executor: 0,
    overwhelmed_analyst: 0,
  };

  let highestWeightQuestion: { key: string; weight: number } | null = null;

  for (const q of questions) {
    if (q.scoringWeight === 0 || !q.scoringMap) continue;

    const answer = answers[q.questionKey];
    if (!answer) continue;

    const scoringMap: Record<string, Record<string, number>> = JSON.parse(q.scoringMap);
    const answerScores = scoringMap[answer];
    if (!answerScores) continue;

    for (const [personalityType, points] of Object.entries(answerScores)) {
      if (personalityType in scores) {
        scores[personalityType as PersonalityType] += points;
      }
    }

    if (!highestWeightQuestion || q.scoringWeight > highestWeightQuestion.weight) {
      highestWeightQuestion = { key: q.questionKey, weight: q.scoringWeight };
    }
  }

  // Find highest score
  let maxScore = 0;
  let maxType: PersonalityType = 'emotional_trader';
  let hasTie = false;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as PersonalityType;
      hasTie = false;
    } else if (score === maxScore && score > 0) {
      hasTie = true;
    }
  }

  // Tiebreaker: use answer from highest-weighted question
  if (hasTie && highestWeightQuestion) {
    const tieAnswer = answers[highestWeightQuestion.key];
    if (tieAnswer) {
      const tieQuestion = questions.find((q) => q.questionKey === highestWeightQuestion!.key);
      if (tieQuestion?.scoringMap) {
        const tieMap: Record<string, Record<string, number>> = JSON.parse(tieQuestion.scoringMap);
        const tieScores = tieMap[tieAnswer];
        if (tieScores) {
          // Pick the type with highest points in tiebreaker question
          let tieMax = 0;
          for (const [type, points] of Object.entries(tieScores)) {
            if (points > tieMax && type in scores) {
              tieMax = points;
              maxType = type as PersonalityType;
            }
          }
        }
      }
    }
  }

  return { type: maxType, scores };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, locale } = body;
    const emailLocale: string = locale === 'ru' ? 'ru' : 'en';

    let personalityType: string;
    let scores: Record<string, number>;
    let firstName: string;
    let email: string;
    let experienceLevel: string;
    let performance: string;
    let automationExperience: string;
    let biggestChallenge: string;
    let decisionStyle: string;

    if (formId) {
      // Dynamic form submission
      const form = await prisma.quizForm.findUnique({
        where: { id: formId },
        include: { questions: { orderBy: { position: 'asc' } } },
      });

      if (!form) {
        return NextResponse.json({ error: 'Form not found' }, { status: 404 });
      }

      // Validate required fields from form questions
      for (const q of form.questions) {
        if (q.required && !body[q.questionKey]) {
          return NextResponse.json({ error: `Field "${q.questionKey}" is required` }, { status: 400 });
        }
      }

      firstName = body.first_name || body.firstName || '';
      email = body.email || '';

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
      }

      // Calculate personality type using form's scoring config
      const result = calculateFromFormScoring(body, form.questions);
      personalityType = result.type;
      scores = result.scores;

      // Map known fields, default to 'unknown' for missing standard fields
      experienceLevel = body.experience_level || 'unknown';
      performance = body.performance || 'unknown';
      automationExperience = body.automation_experience || 'unknown';
      biggestChallenge = body.biggest_challenge || 'unknown';
      decisionStyle = body.decision_style || 'unknown';
    } else {
      // Legacy hardcoded submission
      const { first_name, email: emailVal, experience_level, performance: perf, biggest_challenge, decision_style, automation_experience } = body;

      if (!first_name || !emailVal || !experience_level || !perf || !biggest_challenge || !decision_style || !automation_experience) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
      }

      const result = calculatePersonalityType(biggest_challenge, decision_style);
      personalityType = result.type;
      scores = result.scores;
      firstName = first_name;
      email = emailVal;
      experienceLevel = experience_level;
      performance = perf;
      automationExperience = automation_experience;
      biggestChallenge = biggest_challenge;
      decisionStyle = decision_style;
    }

    // Upsert contact
    const contact = await prisma.contact.upsert({
      where: { email },
      create: {
        email,
        firstName,
        personalityType,
        experienceLevel,
        performance,
        automationExperience,
        biggestChallenge,
        decisionStyle,
        scores: JSON.stringify(scores),
        locale: emailLocale,
      },
      update: {
        firstName,
        personalityType,
        experienceLevel,
        performance,
        automationExperience,
        biggestChallenge,
        decisionStyle,
        scores: JSON.stringify(scores),
        locale: emailLocale,
      },
    });

    // Schedule emails (days 0, 1, 3, 5, 7, 10, 14, 17)
    const emailDays = [0, 1, 3, 5, 7, 10, 14, 17];
    const now = new Date();

    // Delete any existing scheduled emails for this contact
    await prisma.emailSchedule.deleteMany({
      where: { contactId: contact.id, status: 'pending' },
    });

    // Create new email schedule
    await prisma.emailSchedule.createMany({
      data: emailDays.map((day, index) => ({
        contactId: contact.id,
        emailNumber: index + 1,
        scheduledAt: new Date(now.getTime() + day * 24 * 60 * 60 * 1000),
        status: 'pending',
      })),
    });

    // Try to send to Brevo (non-blocking, don't fail the quiz if this errors)
    try {
      const brevoApiKey = process.env.BREVO_API_KEY;
      if (brevoApiKey) {
        const { createBrevoContact, sendTransactionalEmail } = await import('@/lib/brevo');
        const templateModule = emailLocale === 'ru'
          ? await import('@/lib/email-templates-ru')
          : await import('@/lib/email-templates');
        const getEmailTemplate = emailLocale === 'ru'
          ? (templateModule as typeof import('@/lib/email-templates-ru')).getEmailTemplateRu
          : (templateModule as typeof import('@/lib/email-templates')).getEmailTemplate;

        // Create contact in Brevo
        await createBrevoContact({
          email,
          firstName,
          personalityType,
          experienceLevel,
          performance,
          automationExperience,
        });

        // Send immediate welcome email (Email #1)
        const emailTemplate = getEmailTemplate(personalityType as PersonalityType, 1);
        if (emailTemplate) {
          const { subject, html } = emailTemplate(firstName);
          await sendTransactionalEmail({
            to: email,
            toName: firstName,
            subject,
            htmlContent: html,
          });

          // Mark email #1 as sent
          await prisma.emailSchedule.updateMany({
            where: { contactId: contact.id, emailNumber: 1 },
            data: { status: 'sent', sentAt: new Date() },
          });
        }
      }
    } catch (brevoError) {
      console.error('Brevo sync error (non-fatal):', brevoError);
    }

    return NextResponse.json({
      personalityType,
      scores,
      contactId: contact.id,
    });
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
