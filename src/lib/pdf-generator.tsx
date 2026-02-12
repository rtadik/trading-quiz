import React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { PersonalityType } from './scoring';
import { PERSONALITY_TYPES, PersonalityTypeInfo } from './personality-types';

const colors = {
  emotional_trader: { primary: '#EF4444', light: '#FEF2F2', accent: '#DC2626' },
  time_starved_trader: { primary: '#3B82F6', light: '#EFF6FF', accent: '#2563EB' },
  inconsistent_executor: { primary: '#F59E0B', light: '#FFFBEB', accent: '#D97706' },
  overwhelmed_analyst: { primary: '#8B5CF6', light: '#F5F3FF', accent: '#7C3AED' },
};

const styles = StyleSheet.create({
  page: { padding: 50, fontFamily: 'Helvetica', fontSize: 11, lineHeight: 1.6, color: '#1a1a2e' },
  // Cover page
  coverPage: { padding: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  coverContent: { textAlign: 'center', marginTop: 180 },
  coverTitle: { fontSize: 28, fontFamily: 'Helvetica-Bold', marginBottom: 16, color: '#1a1a2e' },
  coverSubtitle: { fontSize: 16, color: '#6b7280', marginBottom: 8 },
  coverName: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 30 },
  coverType: { fontSize: 22, fontFamily: 'Helvetica-Bold', marginBottom: 8 },
  coverTagline: { fontSize: 13, color: '#6b7280', marginBottom: 40 },
  coverFooter: { fontSize: 10, color: '#9ca3af', position: 'absolute', bottom: 50, left: 0, right: 0, textAlign: 'center' },
  // Regular pages
  pageTitle: { fontSize: 22, fontFamily: 'Helvetica-Bold', marginBottom: 20, color: '#1a1a2e' },
  sectionTitle: { fontSize: 15, fontFamily: 'Helvetica-Bold', marginBottom: 8, marginTop: 16 },
  paragraph: { marginBottom: 12, fontSize: 11, lineHeight: 1.7 },
  challengeBox: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 12 },
  challengeTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginBottom: 6 },
  challengeText: { fontSize: 10.5, lineHeight: 1.6, color: '#4b5563' },
  strengthBox: { borderRadius: 8, padding: 16, marginBottom: 12 },
  stepNumber: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  stepTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 6 },
  stepText: { fontSize: 10.5, lineHeight: 1.6, color: '#4b5563' },
  stepBox: { borderLeftWidth: 3, borderLeftStyle: 'solid', paddingLeft: 14, marginBottom: 14 },
  bulletItem: { fontSize: 10.5, lineHeight: 1.7, marginBottom: 4, paddingLeft: 12, color: '#4b5563' },
  automationBox: { backgroundColor: '#f0f7ff', borderRadius: 8, padding: 18, marginTop: 16 },
  automationTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 8, color: '#1e40af' },
  automationText: { fontSize: 10.5, lineHeight: 1.7, color: '#374151' },
  ctaBox: { backgroundColor: '#1a1a2e', borderRadius: 8, padding: 20, marginTop: 20, textAlign: 'center' },
  ctaTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 8 },
  ctaText: { fontSize: 11, color: '#d1d5db', lineHeight: 1.6 },
  footer: { position: 'absolute', bottom: 30, left: 50, right: 50, textAlign: 'center', fontSize: 9, color: '#9ca3af' },
  colorBar: { height: 4, marginBottom: 20 },
});

interface PDFReportProps {
  type: PersonalityType;
  name: string;
}

function PDFReport({ type, name }: PDFReportProps) {
  const info: PersonalityTypeInfo = PERSONALITY_TYPES[type];
  const typeColors = colors[type];

  return (
    <Document>
      {/* Page 1: Cover */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverContent}>
          <Text style={styles.coverTitle}>Your Trading Personality Report</Text>
          <Text style={styles.coverSubtitle}>Prepared for</Text>
          <Text style={styles.coverName}>{name}</Text>
          <View style={{ backgroundColor: typeColors.primary, height: 3, width: 100, marginBottom: 24, marginLeft: 'auto', marginRight: 'auto' } as any} />
          <Text style={[styles.coverType, { color: typeColors.primary }]}>{info.emoji} {info.name}</Text>
          <Text style={styles.coverTagline}>{info.tagline}</Text>
        </View>
        <Text style={styles.coverFooter}>Trading Personality Quiz | Confidential Report</Text>
      </Page>

      {/* Page 2: Your Trading Personality */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.colorBar, { backgroundColor: typeColors.primary }]} />
        <Text style={styles.pageTitle}>Your Trading Personality</Text>
        <Text style={[styles.sectionTitle, { color: typeColors.primary }]}>{info.emoji} {info.name}</Text>
        {info.personalityDescription.split('\n\n').map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Why You&apos;re in This Category</Text>
        {info.whyThisCategory.split('\n\n').map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
        <Text style={styles.footer}>Page 2 | {info.name}</Text>
      </Page>

      {/* Page 3: Your Biggest Challenges */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.colorBar, { backgroundColor: typeColors.primary }]} />
        <Text style={styles.pageTitle}>Your Biggest Challenges</Text>
        {info.challenges.map((challenge, i) => (
          <View key={i} style={styles.challengeBox}>
            <Text style={styles.challengeTitle}>⚠️ Challenge #{i + 1}: {challenge.title}</Text>
            <Text style={styles.challengeText}>{challenge.description}</Text>
          </View>
        ))}
        <Text style={styles.footer}>Page 3 | {info.name}</Text>
      </Page>

      {/* Page 4: Your Strengths */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.colorBar, { backgroundColor: typeColors.primary }]} />
        <Text style={styles.pageTitle}>Your Strengths</Text>
        <Text style={styles.paragraph}>
          Being {info.name.replace('The ', 'a').toLowerCase()} isn&apos;t all bad. You have genuine strengths that many traders lack:
        </Text>
        {info.strengths.map((strength, i) => (
          <View key={i} style={[styles.strengthBox, { backgroundColor: typeColors.light }]}>
            <Text style={[styles.challengeTitle, { color: typeColors.accent }]}>✅ Strength #{i + 1}: {strength.title}</Text>
            <Text style={styles.challengeText}>{strength.description}</Text>
          </View>
        ))}
        <Text style={styles.footer}>Page 4 | {info.name}</Text>
      </Page>

      {/* Page 5: Actionable Improvement Plan */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.colorBar, { backgroundColor: typeColors.primary }]} />
        <Text style={styles.pageTitle}>Your Actionable Improvement Plan</Text>
        {info.improvementSteps.map((step, i) => {
          const stepEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
          return (
            <View key={i} style={[styles.stepBox, { borderLeftColor: typeColors.primary }]}>
              <Text style={[styles.stepNumber, { color: typeColors.primary }]}>STEP {i + 1}</Text>
              <Text style={styles.stepTitle}>{stepEmojis[i]} {step.title}</Text>
              <Text style={styles.stepText}>{step.description}</Text>
            </View>
          );
        })}
        <Text style={styles.footer}>Page 5 | {info.name}</Text>
      </Page>

      {/* Page 6: How Successful Traders Transform */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.colorBar, { backgroundColor: typeColors.primary }]} />
        <Text style={styles.pageTitle}>How Successful {info.name.replace('The ', '')}s Transform</Text>
        <Text style={styles.paragraph}>{info.transformSection.intro}</Text>
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>What They Do Differently:</Text>
        {info.transformSection.whatTheyDo.map((item, i) => (
          <Text key={i} style={styles.bulletItem}>• {item}</Text>
        ))}
        <View style={styles.automationBox}>
          <Text style={styles.automationTitle}>🤖 The Automation Advantage</Text>
          <Text style={styles.automationText}>{info.transformSection.automationAdvantage}</Text>
        </View>
        <Text style={styles.footer}>Page 6 | {info.name}</Text>
      </Page>

      {/* Page 7: Next Steps */}
      <Page size="A4" style={styles.page}>
        <View style={[styles.colorBar, { backgroundColor: typeColors.primary }]} />
        <Text style={styles.pageTitle}>Your Next Steps</Text>
        <Text style={styles.sectionTitle}>Recommended Reading</Text>
        <Text style={styles.paragraph}>
          &quot;{info.nextSteps.bookTitle}&quot; by {info.nextSteps.bookAuthor}
        </Text>
        <Text style={styles.sectionTitle}>Join Our Community</Text>
        <Text style={styles.paragraph}>
          Connect with other traders working to improve their consistency. Share wins, learn from losses, get accountability.
        </Text>
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>💡 {info.nextSteps.ctaHeadline}</Text>
          <Text style={styles.ctaText}>{info.nextSteps.ctaDescription}</Text>
        </View>
        <Text style={[styles.paragraph, { marginTop: 20, textAlign: 'center', color: '#6b7280' }]}>
          Thank you for taking the Trading Personality Quiz, {name}. Your journey to better trading starts now.
        </Text>
        <Text style={styles.footer}>Page 7 | {info.name}</Text>
      </Page>
    </Document>
  );
}

export async function generatePDF(type: PersonalityType, name: string): Promise<Buffer> {
  const buffer = await renderToBuffer(<PDFReport type={type} name={name} />);
  return Buffer.from(buffer);
}
