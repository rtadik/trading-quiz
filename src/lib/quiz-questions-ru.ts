import { QuizQuestion } from './quiz-questions';

export const QUIZ_QUESTIONS_RU: QuizQuestion[] = [
  {
    id: 'first_name',
    type: 'text',
    question: 'Как вас зовут?',
    placeholder: 'Введите ваше имя',
  },
  {
    id: 'email',
    type: 'email',
    question: 'Куда отправить ваш персональный отчёт?',
    placeholder: 'ваш@email.com',
  },
  {
    id: 'experience_level',
    type: 'multiple_choice',
    question: 'Как давно вы торгуете?',
    options: [
      { value: 'beginner', label: 'Менее 6 месяцев' },
      { value: 'intermediate', label: 'От 6 месяцев до 2 лет' },
      { value: 'experienced', label: 'Более 2 лет' },
    ],
  },
  {
    id: 'performance',
    type: 'multiple_choice',
    question: 'Как в целом складывается ваша торговля?',
    options: [
      { value: 'struggling', label: 'В основном убытки, ещё учусь' },
      { value: 'breaking_even', label: 'Выхожу в ноль: есть и прибыль, и потери' },
      { value: 'inconsistent_profit', label: 'Небольшая прибыль, но очень нестабильная' },
      { value: 'undisclosed', label: 'Предпочитаю не отвечать' },
    ],
  },
  {
    id: 'biggest_challenge',
    type: 'multiple_choice',
    question: 'Что сейчас является вашей ГЛАВНОЙ проблемой в трейдинге?',
    options: [
      { value: 'emotional_decisions', label: 'Эмоциональные решения (FOMO, страх, торговля на эмоциях)' },
      { value: 'not_enough_time', label: 'Нет времени следить за рынком и исполнять сделки' },
      { value: 'plan_not_sticking', label: 'Есть торговый план, но я его не придерживаюсь' },
      { value: 'too_much_info', label: 'Слишком много информации, не знаю на чём сосредоточиться' },
    ],
  },
  {
    id: 'decision_style',
    type: 'multiple_choice',
    question: 'Как вы обычно принимаете торговые решения?',
    options: [
      { value: 'gut_feeling', label: 'По интуиции или по хайпу в социальных сетях' },
      { value: 'analyze_miss_entry', label: 'Долго анализирую, но часто упускаю точку входа' },
      { value: 'rules_but_break', label: 'У меня есть правила, но в нужный момент я их нарушаю' },
      { value: 'still_figuring_out', label: 'Ещё нахожусь в поиске своего подхода' },
    ],
  },
  {
    id: 'automation_experience',
    type: 'multiple_choice',
    question: 'Думали ли вы об автоматической торговле?',
    options: [
      { value: 'automation_newbie', label: 'Никогда не пробовал, не понимаю как это работает' },
      { value: 'automation_skeptic', label: 'Пробовал, но не получилось' },
      { value: 'automation_ready', label: 'Очень интересует, но не знаю с чего начать' },
      { value: 'automation_user', label: 'Уже использую некоторую автоматизацию' },
    ],
  },
];
