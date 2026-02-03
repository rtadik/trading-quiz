import { prisma } from './db';
import { sendTransactionalEmail } from './brevo';
import { getEmailTemplate } from './email-templates';
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
    include: { contact: true },
    take: 50, // Process in batches
    orderBy: { scheduledAt: 'asc' },
  });

  for (const scheduled of pendingEmails) {
    try {
      const template = getEmailTemplate(
        scheduled.contact.personalityType as PersonalityType,
        scheduled.emailNumber
      );

      if (!template) {
        console.error(`No template found for type=${scheduled.contact.personalityType} email=${scheduled.emailNumber}`);
        await prisma.emailSchedule.update({
          where: { id: scheduled.id },
          data: { status: 'failed' },
        });
        errors++;
        continue;
      }

      const { subject, html } = template(scheduled.contact.firstName);

      const result = await sendTransactionalEmail({
        to: scheduled.contact.email,
        toName: scheduled.contact.firstName,
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
