import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculatePersonalityType } from '@/lib/scoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { first_name, email, experience_level, performance, biggest_challenge, decision_style, automation_experience, locale } = body;
    const emailLocale: string = locale === 'ru' ? 'ru' : 'en';

    // Validate required fields
    if (!first_name || !email || !experience_level || !performance || !biggest_challenge || !decision_style || !automation_experience) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Calculate personality type
    const { type: personalityType, scores } = calculatePersonalityType(biggest_challenge, decision_style);

    // Upsert contact
    const contact = await prisma.contact.upsert({
      where: { email },
      create: {
        email,
        firstName: first_name,
        personalityType,
        experienceLevel: experience_level,
        performance,
        automationExperience: automation_experience,
        biggestChallenge: biggest_challenge,
        decisionStyle: decision_style,
        scores: JSON.stringify(scores),
        locale: emailLocale,
      },
      update: {
        firstName: first_name,
        personalityType,
        experienceLevel: experience_level,
        performance,
        automationExperience: automation_experience,
        biggestChallenge: biggest_challenge,
        decisionStyle: decision_style,
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
          firstName: first_name,
          personalityType,
          experienceLevel: experience_level,
          performance,
          automationExperience: automation_experience,
        });

        // Send immediate welcome email (Email #1)
        const emailTemplate = getEmailTemplate(personalityType, 1);
        if (emailTemplate) {
          const { subject, html } = emailTemplate(first_name);
          await sendTransactionalEmail({
            to: email,
            toName: first_name,
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
