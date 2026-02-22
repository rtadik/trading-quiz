import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SCORING_MAP_Q5 = JSON.stringify({
  emotional_decisions: { emotional_trader: 3 },
  not_enough_time: { time_starved_trader: 3 },
  plan_not_sticking: { inconsistent_executor: 3 },
  too_much_info: { overwhelmed_analyst: 3 },
});

const SCORING_MAP_Q6 = JSON.stringify({
  gut_feeling: { emotional_trader: 2 },
  analyze_miss_entry: { overwhelmed_analyst: 1, time_starved_trader: 1 },
  rules_but_break: { inconsistent_executor: 2 },
  still_figuring_out: { overwhelmed_analyst: 2 },
});

const EN_QUESTIONS = [
  {
    questionKey: 'first_name',
    type: 'text',
    question: 'What should we call you?',
    placeholder: 'Enter your first name',
    options: null,
    position: 0,
    scoringWeight: 0,
    scoringMap: null,
  },
  {
    questionKey: 'email',
    type: 'email',
    question: 'Where should we send your Trading Personality Report?',
    placeholder: 'your@email.com',
    options: null,
    position: 1,
    scoringWeight: 0,
    scoringMap: null,
  },
  {
    questionKey: 'experience_level',
    type: 'multiple_choice',
    question: 'How long have you been trading?',
    placeholder: null,
    options: JSON.stringify([
      { value: 'beginner', label: 'Less than 6 months' },
      { value: 'intermediate', label: '6 months - 2 years' },
      { value: 'experienced', label: '2+ years' },
    ]),
    position: 2,
    scoringWeight: 0,
    scoringMap: null,
  },
  {
    questionKey: 'performance',
    type: 'multiple_choice',
    question: 'Overall, how has your trading journey been so far?',
    placeholder: null,
    options: JSON.stringify([
      { value: 'struggling', label: 'Mostly losses, still learning the ropes' },
      { value: 'breaking_even', label: 'Breaking even, some wins and losses' },
      { value: 'inconsistent_profit', label: 'Small profits but very inconsistent' },
      { value: 'undisclosed', label: 'Prefer not to say' },
    ]),
    position: 3,
    scoringWeight: 0,
    scoringMap: null,
  },
  {
    questionKey: 'biggest_challenge',
    type: 'multiple_choice',
    question: "What's your BIGGEST struggle in trading right now?",
    placeholder: null,
    options: JSON.stringify([
      { value: 'emotional_decisions', label: 'Making emotional decisions (FOMO, fear, revenge trading)' },
      { value: 'not_enough_time', label: 'Not enough time to monitor markets and execute trades' },
      { value: 'plan_not_sticking', label: 'Having a trading plan but not sticking to it' },
      { value: 'too_much_info', label: "Too much information, don't know what to focus on" },
    ]),
    position: 4,
    scoringWeight: 3,
    scoringMap: SCORING_MAP_Q5,
  },
  {
    questionKey: 'decision_style',
    type: 'multiple_choice',
    question: 'How do you typically make trading decisions?',
    placeholder: null,
    options: JSON.stringify([
      { value: 'gut_feeling', label: 'Based on gut feeling or market hype on social media' },
      { value: 'analyze_miss_entry', label: 'I analyze thoroughly but often miss the entry point' },
      { value: 'rules_but_break', label: 'I have rules but tend to break them in the moment' },
      { value: 'still_figuring_out', label: "I'm still figuring out my approach" },
    ]),
    position: 5,
    scoringWeight: 2,
    scoringMap: SCORING_MAP_Q6,
  },
  {
    questionKey: 'automation_experience',
    type: 'multiple_choice',
    question: 'Have you ever considered automated trading?',
    placeholder: null,
    options: JSON.stringify([
      { value: 'automation_newbie', label: "Never tried it, not sure how it works" },
      { value: 'automation_skeptic', label: "Tried it but didn't work out" },
      { value: 'automation_ready', label: "Very interested but don't know where to start" },
      { value: 'automation_user', label: 'Currently using some automation' },
    ]),
    position: 6,
    scoringWeight: 0,
    scoringMap: null,
  },
];

const RU_QUESTIONS = [
  {
    questionKey: 'first_name',
    type: 'text',
    question: 'Как вас зовут?',
    placeholder: 'Введите ваше имя',
    options: null,
    position: 0,
    scoringWeight: 0,
    scoringMap: null,
  },
  {
    questionKey: 'email',
    type: 'email',
    question: 'Куда отправить ваш персональный отчёт?',
    placeholder: 'ваш@email.com',
    options: null,
    position: 1,
    scoringWeight: 0,
    scoringMap: null,
  },
  {
    questionKey: 'experience_level',
    type: 'multiple_choice',
    question: 'Как давно вы торгуете?',
    placeholder: null,
    options: JSON.stringify([
      { value: 'beginner', label: 'Менее 6 месяцев' },
      { value: 'intermediate', label: 'От 6 месяцев до 2 лет' },
      { value: 'experienced', label: 'Более 2 лет' },
    ]),
    position: 2,
    scoringWeight: 0,
    scoringMap: null,
  },
  {
    questionKey: 'performance',
    type: 'multiple_choice',
    question: 'Как в целом складывается ваша торговля?',
    placeholder: null,
    options: JSON.stringify([
      { value: 'struggling', label: 'В основном убытки, ещё учусь' },
      { value: 'breaking_even', label: 'Выхожу в ноль: есть и прибыль, и потери' },
      { value: 'inconsistent_profit', label: 'Небольшая прибыль, но очень нестабильная' },
      { value: 'undisclosed', label: 'Предпочитаю не отвечать' },
    ]),
    position: 3,
    scoringWeight: 0,
    scoringMap: null,
  },
  {
    questionKey: 'biggest_challenge',
    type: 'multiple_choice',
    question: 'Что сейчас является вашей ГЛАВНОЙ проблемой в трейдинге?',
    placeholder: null,
    options: JSON.stringify([
      { value: 'emotional_decisions', label: 'Эмоциональные решения (FOMO, страх, торговля на эмоциях)' },
      { value: 'not_enough_time', label: 'Нет времени следить за рынком и исполнять сделки' },
      { value: 'plan_not_sticking', label: 'Есть торговый план, но я его не придерживаюсь' },
      { value: 'too_much_info', label: 'Слишком много информации, не знаю на чём сосредоточиться' },
    ]),
    position: 4,
    scoringWeight: 3,
    scoringMap: SCORING_MAP_Q5,
  },
  {
    questionKey: 'decision_style',
    type: 'multiple_choice',
    question: 'Как вы обычно принимаете торговые решения?',
    placeholder: null,
    options: JSON.stringify([
      { value: 'gut_feeling', label: 'По интуиции или по хайпу в социальных сетях' },
      { value: 'analyze_miss_entry', label: 'Долго анализирую, но часто упускаю точку входа' },
      { value: 'rules_but_break', label: 'У меня есть правила, но в нужный момент я их нарушаю' },
      { value: 'still_figuring_out', label: 'Ещё нахожусь в поиске своего подхода' },
    ]),
    position: 5,
    scoringWeight: 2,
    scoringMap: SCORING_MAP_Q6,
  },
  {
    questionKey: 'automation_experience',
    type: 'multiple_choice',
    question: 'Думали ли вы об автоматической торговле?',
    placeholder: null,
    options: JSON.stringify([
      { value: 'automation_newbie', label: 'Никогда не пробовал, не понимаю как это работает' },
      { value: 'automation_skeptic', label: 'Пробовал, но не получилось' },
      { value: 'automation_ready', label: 'Очень интересует, но не знаю с чего начать' },
      { value: 'automation_user', label: 'Уже использую некоторую автоматизацию' },
    ]),
    position: 6,
    scoringWeight: 0,
    scoringMap: null,
  },
];

async function main() {
  console.log('Seeding quiz forms...');

  // Upsert English form
  const enForm = await prisma.quizForm.upsert({
    where: { slug: 'en-default' },
    update: { name: 'English Default', locale: 'en', status: 'published', resultsPath: '/results' },
    create: {
      name: 'English Default',
      slug: 'en-default',
      locale: 'en',
      status: 'published',
      resultsPath: '/results',
      description: 'Default English trading personality quiz',
    },
  });
  console.log(`English form: ${enForm.id}`);

  // Upsert Russian form
  const ruForm = await prisma.quizForm.upsert({
    where: { slug: 'ru-default' },
    update: { name: 'Russian Default', locale: 'ru', status: 'published', resultsPath: '/moscow/results' },
    create: {
      name: 'Russian Default',
      slug: 'ru-default',
      locale: 'ru',
      status: 'published',
      resultsPath: '/moscow/results',
      description: 'Default Russian trading personality quiz',
    },
  });
  console.log(`Russian form: ${ruForm.id}`);

  // Delete existing questions and re-create
  await prisma.quizFormQuestion.deleteMany({ where: { formId: enForm.id } });
  await prisma.quizFormQuestion.deleteMany({ where: { formId: ruForm.id } });

  await prisma.quizFormQuestion.createMany({
    data: EN_QUESTIONS.map((q) => ({ ...q, formId: enForm.id })),
  });
  console.log(`Created ${EN_QUESTIONS.length} English questions`);

  await prisma.quizFormQuestion.createMany({
    data: RU_QUESTIONS.map((q) => ({ ...q, formId: ruForm.id })),
  });
  console.log(`Created ${RU_QUESTIONS.length} Russian questions`);

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
