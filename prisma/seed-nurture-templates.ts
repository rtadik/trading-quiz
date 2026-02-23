import { PrismaClient } from '@prisma/client';
import path from 'path';
import { getAllEmailTemplates } from '../src/lib/email-templates';
import { getAllEmailTemplatesRu } from '../src/lib/email-templates-ru';

const prisma = new PrismaClient();

const PLACEHOLDER = '{{firstName}}';

async function main() {
  let upserted = 0;

  // Seed EN templates
  const enTemplates = getAllEmailTemplates();
  for (const [personalityType, emailFns] of Object.entries(enTemplates)) {
    for (let i = 0; i < emailFns.length; i++) {
      const emailNumber = i + 1;
      const { subject, html } = emailFns[i](PLACEHOLDER);

      await prisma.nurtureTemplate.upsert({
        where: {
          personalityType_emailNumber_locale: {
            personalityType,
            emailNumber,
            locale: 'en',
          },
        },
        create: {
          personalityType,
          emailNumber,
          locale: 'en',
          subject,
          body: html,
        },
        update: {
          subject,
          body: html,
        },
      });
      upserted++;
    }
  }

  // Seed RU templates
  const ruTemplates = getAllEmailTemplatesRu();
  for (const [personalityType, emailFns] of Object.entries(ruTemplates)) {
    for (let i = 0; i < emailFns.length; i++) {
      const emailNumber = i + 1;
      const { subject, html } = emailFns[i](PLACEHOLDER);

      await prisma.nurtureTemplate.upsert({
        where: {
          personalityType_emailNumber_locale: {
            personalityType,
            emailNumber,
            locale: 'ru',
          },
        },
        create: {
          personalityType,
          emailNumber,
          locale: 'ru',
          subject,
          body: html,
        },
        update: {
          subject,
          body: html,
        },
      });
      upserted++;
    }
  }

  console.log(`✅ Seeded ${upserted} nurture templates (${upserted / 2} EN + ${upserted / 2} RU)`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
