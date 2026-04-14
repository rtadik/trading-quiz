import React from 'react';
import path from 'path';
import { Document, Page, Text, View, StyleSheet, Font, renderToBuffer } from '@react-pdf/renderer';
import { PersonalityType } from './scoring';
import { PERSONALITY_TYPES, PersonalityTypeInfo } from './personality-types';
import { PERSONALITY_TYPES_RU } from './personality-types-ru';

// Register Roboto font (supports Latin + Cyrillic)
const fontsDir = path.join(process.cwd(), 'public', 'fonts');
Font.register({
  family: 'Roboto',
  fonts: [
    { src: path.join(fontsDir, 'Roboto-Regular.ttf'), fontWeight: 400 },
    { src: path.join(fontsDir, 'Roboto-Bold.ttf'), fontWeight: 700 },
  ],
});

const colors = {
  emotional_trader: { primary: '#EF4444', light: '#FEF2F2', accent: '#DC2626' },
  time_starved_trader: { primary: '#3B82F6', light: '#EFF6FF', accent: '#2563EB' },
  inconsistent_executor: { primary: '#F59E0B', light: '#FFFBEB', accent: '#D97706' },
  overwhelmed_analyst: { primary: '#8B5CF6', light: '#F5F3FF', accent: '#7C3AED' },
};

const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Roboto', fontSize: 11, lineHeight: 1.6, color: '#1a1a2e' },
  // Cover page
  coverPage: { padding: 50, fontFamily: 'Roboto', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  coverContent: { textAlign: 'center', marginTop: 180 },
  coverTitle: { fontSize: 28, fontFamily: 'Roboto', fontWeight: 700, marginBottom: 16, color: '#1a1a2e' },
  coverSubtitle: { fontSize: 16, color: '#6b7280', marginBottom: 8 },
  coverName: { fontSize: 20, fontFamily: 'Roboto', fontWeight: 700, marginBottom: 30 },
  coverType: { fontSize: 22, fontFamily: 'Roboto', fontWeight: 700, marginBottom: 8 },
  coverTagline: { fontSize: 13, color: '#6b7280', marginBottom: 40 },
  coverFooter: { fontSize: 10, color: '#9ca3af', position: 'absolute', bottom: 50, left: 0, right: 0, textAlign: 'center' },
  // Regular pages
  pageTitle: { fontSize: 22, fontFamily: 'Roboto', fontWeight: 700, marginBottom: 20, color: '#1a1a2e' },
  sectionTitle: { fontSize: 15, fontFamily: 'Roboto', fontWeight: 700, marginBottom: 8, marginTop: 16 },
  paragraph: { marginBottom: 12, fontSize: 11, lineHeight: 1.7 },
  challengeBox: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 12 },
  challengeTitle: { fontSize: 13, fontFamily: 'Roboto', fontWeight: 700, marginBottom: 6 },
  challengeText: { fontSize: 10.5, lineHeight: 1.6, color: '#4b5563' },
  strengthBox: { borderRadius: 8, padding: 16, marginBottom: 12 },
  stepNumber: { fontSize: 10, fontFamily: 'Roboto', fontWeight: 700, marginBottom: 4 },
  stepTitle: { fontSize: 12, fontFamily: 'Roboto', fontWeight: 700, marginBottom: 6 },
  stepText: { fontSize: 10.5, lineHeight: 1.6, color: '#4b5563' },
  stepBox: { borderLeftWidth: 3, borderLeftStyle: 'solid', paddingLeft: 14, marginBottom: 14 },
  bulletItem: { fontSize: 10.5, lineHeight: 1.7, marginBottom: 4, paddingLeft: 12, color: '#4b5563' },
  automationBox: { backgroundColor: '#f0f7ff', borderRadius: 8, padding: 18, marginTop: 16 },
  automationTitle: { fontSize: 14, fontFamily: 'Roboto', fontWeight: 700, marginBottom: 8, color: '#1e40af' },
  automationText: { fontSize: 10.5, lineHeight: 1.7, color: '#374151' },
  ctaBox: { backgroundColor: '#1a1a2e', borderRadius: 8, padding: 20, marginTop: 20, textAlign: 'center' },
  ctaTitle: { fontSize: 16, fontFamily: 'Roboto', fontWeight: 700, color: '#ffffff', marginBottom: 8 },
  ctaText: { fontSize: 11, color: '#d1d5db', lineHeight: 1.6 },
  footer: { position: 'absolute', bottom: 30, left: 50, right: 50, textAlign: 'center', fontSize: 9, color: '#9ca3af' },
  colorBar: { height: 4, marginBottom: 20 },
});

const UI_STRINGS = {
  en: {
    coverTitle: 'Your Trading Personality Report',
    preparedFor: 'Prepared for',
    coverFooter: 'Trading Personality Quiz | Confidential Report',
    page2Title: 'Your Trading Personality',
    whyCategory: "Why You're in This Category",
    page2Footer: 'Page 2',
    page3Title: 'Your Biggest Challenges',
    challengeLabel: 'Challenge #',
    page3Footer: 'Page 3',
    page4Title: 'Your Strengths',
    strengthsIntro: (typeName: string) => `Being ${typeName.replace('The ', 'a').toLowerCase()} isn't all bad. You have genuine strengths that many traders lack:`,
    strengthLabel: 'Strength #',
    page4Footer: 'Page 4',
    page5Title: 'Your Actionable Improvement Plan',
    stepLabel: 'STEP',
    page5Footer: 'Page 5',
    page6Title: (typeName: string) => `How Successful ${typeName.replace('The ', '')}s Transform`,
    whatTheyDo: 'What They Do Differently:',
    automationTitle: '🤖 The Automation Advantage',
    page6Footer: 'Page 6',
    page7Title: 'Your Next Steps',
    recommendedReading: 'Recommended Reading',
    bookBy: 'by',
    joinCommunity: 'Join Our Community',
    communityText: 'Connect with other traders working to improve their consistency. Share wins, learn from losses, get accountability.',
    thankYou: (name: string) => `Thank you for taking the Trading Personality Quiz, ${name}. Your journey to better trading starts now.`,
    page7Footer: 'Page 7',
  },
  ru: {
    coverTitle: 'Ваш отчёт о торговой личности',
    preparedFor: 'Подготовлено для',
    coverFooter: 'Тест торговой личности | Конфиденциальный отчёт',
    page2Title: 'Ваша торговая личность',
    whyCategory: 'Почему вы в этой категории',
    page2Footer: 'Страница 2',
    page3Title: 'Ваши главные трудности',
    challengeLabel: 'Трудность №',
    page3Footer: 'Страница 3',
    page4Title: 'Ваши сильные стороны',
    strengthsIntro: (typeName: string) => `Быть ${typeName.toLowerCase()} — это не только минусы. У вас есть настоящие сильные стороны, которых нет у многих трейдеров:`,
    strengthLabel: 'Сильная сторона №',
    page4Footer: 'Страница 4',
    page5Title: 'Ваш план улучшения',
    stepLabel: 'ШАГ',
    page5Footer: 'Страница 5',
    page6Title: (typeName: string) => `Как успешные ${typeName.toLowerCase()}ы меняются`,
    whatTheyDo: 'Что они делают иначе:',
    automationTitle: '🤖 Преимущество автоматизации',
    page6Footer: 'Страница 6',
    page7Title: 'Ваши следующие шаги',
    recommendedReading: 'Рекомендуемая литература',
    bookBy: 'автор',
    joinCommunity: 'Присоединяйтесь к сообществу',
    communityText: 'Общайтесь с трейдерами, которые работают над своей последовательностью. Делитесь победами, учитесь на потерях, получайте поддержку.',
    thankYou: (name: string) => `Спасибо, что прошли тест торговой личности, ${name}. Ваш путь к лучшей торговле начинается сейчас.`,
    page7Footer: 'Страница 7',
  },
};

interface PDFReportProps {
  type: PersonalityType;
  name: string;
  locale?: string;
}

function PDFReport({ type, name, locale = 'en' }: PDFReportProps) {
  const info: PersonalityTypeInfo = locale === 'ru' ? PERSONALITY_TYPES_RU[type] : PERSONALITY_TYPES[type];
  const typeColors = colors[type];
  const t = locale === 'ru' ? UI_STRINGS.ru : UI_STRINGS.en;

  return (
    <Document>
      {/* Page 1: Cover */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverContent}>
          <Text style={styles.coverTitle}>{t.coverTitle}</Text>
          <Text style={styles.coverSubtitle}>{t.preparedFor}</Text>
          <Text style={styles.coverName}>{name}</Text>
          <View style={{ backgroundColor: typeColors.primary, height: 3, width: 100, marginBottom: 24, marginLeft: 'auto', marginRight: 'auto' } as any} />
          <Text style={[styles.coverType, { color: typeColors.primary }]}>{info.emoji} {info.name}</Text>
          <Text style={styles.coverTagline}>{info.tagline}</Text>
        </View>
        <Text style={styles.coverFooter}>{t.coverFooter}</Text>
      </Page>

      {/* Page 2: Your Trading Personality */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.colorBar, { backgroundColor: typeColors.primary }]} />
        <Text style={styles.pageTitle}>{t.page2Title}</Text>
        <Text style={[styles.sectionTitle, { color: typeColors.primary }]}>{info.emoji} {info.name}</Text>
        {info.personalityDescription.split('\n\n').map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>{t.whyCategory}</Text>
        {info.whyThisCategory.split('\n\n').map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
        <Text style={styles.footer}>{t.page2Footer} | {info.name}</Text>
      </Page>

      {/* Page 3: Your Biggest Challenges */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.colorBar, { backgroundColor: typeColors.primary }]} />
        <Text style={styles.pageTitle}>{t.page3Title}</Text>
        {info.challenges.map((challenge, i) => (
          <View key={i} style={styles.challengeBox}>
            <Text style={styles.challengeTitle}>⚠️ {t.challengeLabel}{i + 1}: {challenge.title}</Text>
            <Text style={styles.challengeText}>{challenge.description}</Text>
          </View>
        ))}
        <Text style={styles.footer}>{t.page3Footer} | {info.name}</Text>
      </Page>

      {/* Page 4: Your Strengths */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.colorBar, { backgroundColor: typeColors.primary }]} />
        <Text style={styles.pageTitle}>{t.page4Title}</Text>
        <Text style={styles.paragraph}>{t.strengthsIntro(info.name)}</Text>
        {info.strengths.map((strength, i) => (
          <View key={i} style={[styles.strengthBox, { backgroundColor: typeColors.light }]}>
            <Text style={[styles.challengeTitle, { color: typeColors.accent }]}>✅ {t.strengthLabel}{i + 1}: {strength.title}</Text>
            <Text style={styles.challengeText}>{strength.description}</Text>
          </View>
        ))}
        <Text style={styles.footer}>{t.page4Footer} | {info.name}</Text>
      </Page>

      {/* Page 5: Actionable Improvement Plan */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.colorBar, { backgroundColor: typeColors.primary }]} />
        <Text style={styles.pageTitle}>{t.page5Title}</Text>
        {info.improvementSteps.map((step, i) => {
          const stepEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
          return (
            <View key={i} style={[styles.stepBox, { borderLeftColor: typeColors.primary }]}>
              <Text style={[styles.stepNumber, { color: typeColors.primary }]}>{t.stepLabel} {i + 1}</Text>
              <Text style={styles.stepTitle}>{stepEmojis[i]} {step.title}</Text>
              <Text style={styles.stepText}>{step.description}</Text>
            </View>
          );
        })}
        <Text style={styles.footer}>{t.page5Footer} | {info.name}</Text>
      </Page>

      {/* Page 6: How Successful Traders Transform */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.colorBar, { backgroundColor: typeColors.primary }]} />
        <Text style={styles.pageTitle}>{t.page6Title(info.name)}</Text>
        <Text style={styles.paragraph}>{info.transformSection.intro}</Text>
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>{t.whatTheyDo}</Text>
        {info.transformSection.whatTheyDo.map((item, i) => (
          <Text key={i} style={styles.bulletItem}>• {item}</Text>
        ))}
        <View style={styles.automationBox}>
          <Text style={styles.automationTitle}>{t.automationTitle}</Text>
          <Text style={styles.automationText}>{info.transformSection.automationAdvantage}</Text>
        </View>
        <Text style={styles.footer}>{t.page6Footer} | {info.name}</Text>
      </Page>

      {/* Page 7: Next Steps */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.colorBar, { backgroundColor: typeColors.primary }]} />
        <Text style={styles.pageTitle}>{t.page7Title}</Text>
        <Text style={styles.sectionTitle}>{t.recommendedReading}</Text>
        <Text style={styles.paragraph}>
          &quot;{info.nextSteps.bookTitle}&quot; {t.bookBy} {info.nextSteps.bookAuthor}
        </Text>
        <Text style={styles.sectionTitle}>{t.joinCommunity}</Text>
        <Text style={styles.paragraph}>{t.communityText}</Text>
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>💡 {info.nextSteps.ctaHeadline}</Text>
          <Text style={styles.ctaText}>{info.nextSteps.ctaDescription}</Text>
        </View>
        <Text style={[styles.paragraph, { marginTop: 20, textAlign: 'center', color: '#6b7280' }]}>
          {t.thankYou(name)}
        </Text>
        <Text style={styles.footer}>{t.page7Footer} | {info.name}</Text>
      </Page>
    </Document>
  );
}

export async function generatePDF(type: PersonalityType, name: string, locale: string = 'en'): Promise<Buffer> {
  const buffer = await renderToBuffer(<PDFReport type={type} name={name} locale={locale} />);
  return Buffer.from(buffer);
}
