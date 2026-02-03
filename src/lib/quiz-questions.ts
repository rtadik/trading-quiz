export interface QuizQuestion {
  id: string;
  type: 'text' | 'email' | 'multiple_choice';
  question: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'first_name',
    type: 'text',
    question: 'What should we call you?',
    placeholder: 'Enter your first name',
  },
  {
    id: 'email',
    type: 'email',
    question: 'Where should we send your Trading Personality Report?',
    placeholder: 'your@email.com',
  },
  {
    id: 'experience_level',
    type: 'multiple_choice',
    question: 'How long have you been trading?',
    options: [
      { value: 'beginner', label: 'Less than 6 months' },
      { value: 'intermediate', label: '6 months - 2 years' },
      { value: 'experienced', label: '2+ years' },
    ],
  },
  {
    id: 'performance',
    type: 'multiple_choice',
    question: 'Overall, how has your trading journey been so far?',
    options: [
      { value: 'struggling', label: 'Mostly losses, still learning the ropes' },
      { value: 'breaking_even', label: 'Breaking even, some wins and losses' },
      { value: 'inconsistent_profit', label: 'Small profits but very inconsistent' },
      { value: 'undisclosed', label: 'Prefer not to say' },
    ],
  },
  {
    id: 'biggest_challenge',
    type: 'multiple_choice',
    question: "What's your BIGGEST struggle in trading right now?",
    options: [
      { value: 'emotional_decisions', label: 'Making emotional decisions (FOMO, fear, revenge trading)' },
      { value: 'not_enough_time', label: 'Not enough time to monitor markets and execute trades' },
      { value: 'plan_not_sticking', label: 'Having a trading plan but not sticking to it' },
      { value: 'too_much_info', label: "Too much information, don't know what to focus on" },
    ],
  },
  {
    id: 'decision_style',
    type: 'multiple_choice',
    question: 'How do you typically make trading decisions?',
    options: [
      { value: 'gut_feeling', label: 'Based on gut feeling or market hype on social media' },
      { value: 'analyze_miss_entry', label: 'I analyze thoroughly but often miss the entry point' },
      { value: 'rules_but_break', label: 'I have rules but tend to break them in the moment' },
      { value: 'still_figuring_out', label: "I'm still figuring out my approach" },
    ],
  },
  {
    id: 'automation_experience',
    type: 'multiple_choice',
    question: 'Have you ever considered automated trading?',
    options: [
      { value: 'automation_newbie', label: "Never tried it, not sure how it works" },
      { value: 'automation_skeptic', label: "Tried it but didn't work out" },
      { value: 'automation_ready', label: "Very interested but don't know where to start" },
      { value: 'automation_user', label: 'Currently using some automation' },
    ],
  },
];
