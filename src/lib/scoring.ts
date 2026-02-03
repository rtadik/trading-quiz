export type PersonalityType =
  | 'emotional_trader'
  | 'time_starved_trader'
  | 'inconsistent_executor'
  | 'overwhelmed_analyst';

export type Scores = Record<PersonalityType, number>;

// Q5 answer keys
const Q5_SCORING: Record<string, PersonalityType> = {
  'emotional_decisions': 'emotional_trader',
  'not_enough_time': 'time_starved_trader',
  'plan_not_sticking': 'inconsistent_executor',
  'too_much_info': 'overwhelmed_analyst',
};

// Q6 answer scoring
const Q6_SCORING: Record<string, Partial<Scores>> = {
  'gut_feeling': { emotional_trader: 2 },
  'analyze_miss_entry': { overwhelmed_analyst: 1, time_starved_trader: 1 },
  'rules_but_break': { inconsistent_executor: 2 },
  'still_figuring_out': { overwhelmed_analyst: 2 },
};

export function calculatePersonalityType(
  q5Answer: string,
  q6Answer: string
): { type: PersonalityType; scores: Scores } {
  const scores: Scores = {
    emotional_trader: 0,
    time_starved_trader: 0,
    inconsistent_executor: 0,
    overwhelmed_analyst: 0,
  };

  // Q5: +3 to corresponding type
  const q5Type = Q5_SCORING[q5Answer];
  if (q5Type) {
    scores[q5Type] += 3;
  }

  // Q6: +1 or +2 to types
  const q6Scores = Q6_SCORING[q6Answer];
  if (q6Scores) {
    for (const [key, value] of Object.entries(q6Scores)) {
      scores[key as PersonalityType] += value;
    }
  }

  // Find highest score
  let maxScore = 0;
  let maxType: PersonalityType = 'emotional_trader';
  let hasTie = false;

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type as PersonalityType;
      hasTie = false;
    } else if (score === maxScore && score > 0) {
      hasTie = true;
    }
  }

  // Tiebreaker: use Q5 answer
  if (hasTie && q5Type) {
    maxType = q5Type;
  }

  return { type: maxType, scores };
}
