#!/usr/bin/env tsx
/**
 * One-time script to generate static Russian PDFs for all 4 personality types.
 * Run with: npx tsx scripts/generate-static-pdfs.tsx
 */

import path from 'path';
import fs from 'fs';
import { generatePDF } from '../src/lib/pdf-generator';
import { PersonalityType } from '../src/lib/scoring';

const types: PersonalityType[] = [
  'emotional_trader',
  'time_starved_trader',
  'inconsistent_executor',
  'overwhelmed_analyst',
];

const slugMap: Record<PersonalityType, string> = {
  emotional_trader: 'emotional-trader',
  time_starved_trader: 'time-starved-trader',
  inconsistent_executor: 'inconsistent-executor',
  overwhelmed_analyst: 'overwhelmed-analyst',
};

const outDir = path.join(process.cwd(), 'public', 'pdfs');

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  for (const type of types) {
    const slug = slugMap[type];

    // Russian
    console.log(`Generating Russian PDF for ${type}...`);
    const ruBuffer = await generatePDF(type, 'Трейдер', 'ru');
    fs.writeFileSync(path.join(outDir, `${slug}-ru.pdf`), ruBuffer);
    console.log(`  ✓ public/pdfs/${slug}-ru.pdf`);

    // English (also generate static EN versions for consistency)
    console.log(`Generating English PDF for ${type}...`);
    const enBuffer = await generatePDF(type, 'Trader', 'en');
    fs.writeFileSync(path.join(outDir, `${slug}-en.pdf`), enBuffer);
    console.log(`  ✓ public/pdfs/${slug}-en.pdf`);
  }

  console.log('\nAll PDFs generated successfully.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
