import { prisma } from './db';
import { sendTransactionalEmail } from './brevo';
import { getEmailTemplate } from './email-templates';
import { getEmailTemplateRu } from './email-templates-ru';
import { PersonalityType } from './scoring';

export async function processEmailQueue(): Promise<{ processed: number; errors: number }> {
  const now = new Date();
  let processed = 0;
  let errors = 0;

  // Get all pending emails that are due
  const pendingEmails = await prisma.emailSchedule.findMany({
    where: {
      status: 'pending',
      scheduledAt: { lte: now },
    },
    include: {
      contact: {
        select: {
          id: true,
          email: true,
          firstName: true,
          personalityType: true,
          locale: true,
        },
      },
    },
    take: 50, // Process in batches
    orderBy: { scheduledAt: 'asc' },
  });

  for (const scheduled of pendingEmails) {
    try {
      const firstName = scheduled.contact.firstName;
      const personalityType = scheduled.contact.personalityType;
      const locale = scheduled.contact.locale ?? 'en';

      // Try DB template first
      const dbTemplate = await prisma.nurtureTemplate.findUnique({
        where: {
          personalityType_emailNumber_locale: {
            personalityType,
            emailNumber: scheduled.emailNumber,
            locale,
          },
        },
      });

      let subject: string;
      let html: string;

      if (dbTemplate) {
        subject = dbTemplate.subject.replace(/\{\{firstName\}\}/g, firstName);
        html = dbTemplate.body.replace(/\{\{firstName\}\}/g, firstName);
      } else {
        // Fallback to hardcoded templates
        const templateFn =
          locale === 'ru'
            ? getEmailTemplateRu(personalityType as PersonalityType, scheduled.emailNumber)
            : getEmailTemplate(personalityType as PersonalityType, scheduled.emailNumber);

        if (!templateFn) {
          console.error(`No template found for type=${personalityType} email=${scheduled.emailNumber} locale=${locale}`);
          await prisma.emailSchedule.update({
            where: { id: scheduled.id },
            data: { status: 'failed' },
          });
          errors++;
          continue;
        }

        ({ subject, html } = templateFn(firstName));
      }

      const result = await sendTransactionalEmail({
        to: scheduled.contact.email,
        toName: firstName,
        subject,
        htmlContent: html,
      });

      await prisma.emailSchedule.update({
        where: { id: scheduled.id },
        data: {
          status: 'sent',
          sentAt: new Date(),
          brevoMessageId: result?.messageId || null,
        },
      });

      processed++;
    } catch (error) {
      console.error(`Failed to send email ${scheduled.id}:`, error);

      await prisma.emailSchedule.update({
        where: { id: scheduled.id },
        data: { status: 'failed' },
      });

      errors++;
    }
  }

  return { processed, errors };
}
