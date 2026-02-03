import { PersonalityType } from './scoring';

export interface PersonalityTypeInfo {
  type: PersonalityType;
  name: string;
  emoji: string;
  tagline: string;
  shortDescription: string;
  quickTip: string;
  color: string;
  bgGradient: string;
  // PDF content
  personalityDescription: string;
  whyThisCategory: string;
  challenges: { title: string; description: string }[];
  strengths: { title: string; description: string }[];
  improvementSteps: { title: string; description: string }[];
  transformSection: { intro: string; whatTheyDo: string[]; automationAdvantage: string };
  nextSteps: { bookTitle: string; bookAuthor: string; ctaHeadline: string; ctaDescription: string };
}

export const PERSONALITY_TYPES: Record<PersonalityType, PersonalityTypeInfo> = {
  emotional_trader: {
    type: 'emotional_trader',
    name: 'The Emotional Trader',
    emoji: '🎭',
    tagline: 'Your emotions are sabotaging your success',
    color: '#FF4FDA',
    bgGradient: 'from-pink-dark to-pink-light',
    shortDescription:
      "You're passionate about trading, but your emotions are sabotaging your success. FOMO, fear, and impulsive decisions are keeping you from consistent profits. The good news? This is one of the easiest problems to fix with the right system.",
    quickTip:
      'Your #1 priority is removing emotion from your trading decisions. Set hard rules BEFORE entering trades and commit to following them no matter what you feel in the moment.',
    personalityDescription:
      "You approach trading with passion and intuition, which can be powerful—but right now, your emotions are making decisions instead of your strategy. You've likely experienced the painful cycle: excitement leading to impulsive entries, fear causing premature exits, and frustration triggering revenge trades.\n\nThis doesn't mean you're a bad trader. It means you're human. The markets are specifically designed to exploit emotional decision-making, and without systems in place to protect you from yourself, even the smartest traders fall into these traps.",
    whyThisCategory:
      'Your quiz responses indicate that emotional impulses—whether FOMO, fear, or the urge to "get back" at the market—are driving your trading decisions more than objective analysis. You might follow a hype trade on Twitter, exit winning positions too early out of fear, or double down after a loss trying to recover quickly.\n\nThe good news? Once you recognize this pattern, it\'s one of the most fixable problems in trading.',
    challenges: [
      {
        title: 'FOMO Entries',
        description:
          "You see a coin pumping, social media is buzzing, and you jump in without a plan. By the time you enter, you're buying at the top from traders who entered earlier with a strategy.",
      },
      {
        title: 'Fear-Based Exits',
        description:
          'You have a winner, but instead of letting it run to your target, fear kicks in. "What if it reverses?" You exit at +5% when your plan was +20%, then watch it hit your original target without you.',
      },
      {
        title: 'Revenge Trading',
        description:
          "After a loss, you feel the need to \"make it back\" immediately. You take a hasty trade without proper setup, usually resulting in an even bigger loss. This emotional spiral can destroy a week's progress in one session.",
      },
      {
        title: 'Breaking Your Own Rules',
        description:
          'You set stop-losses but move them when price approaches. You promise to trade only A+ setups but take B and C setups out of impatience. Your rules are solid; your emotions override them.',
      },
    ],
    strengths: [
      {
        title: 'Passionate & Engaged',
        description:
          "Unlike traders who give up quickly, you're deeply engaged with markets. Your passion means you're willing to learn, adapt, and put in the work. Channel this energy into systematic improvement.",
      },
      {
        title: 'Pattern Recognition',
        description:
          "Your intuitive nature means you often spot patterns quickly. Once you combine this intuition with disciplined execution, you'll have an edge.",
      },
      {
        title: 'Resilience',
        description:
          "You've taken emotional hits but you're still here. That resilience is rare. Most emotional traders quit after big losses. You've survived your mistakes—now it's time to fix the system causing them.",
      },
    ],
    improvementSteps: [
      {
        title: 'Create Pre-Trade Checklists (This Week)',
        description:
          'Before every trade, answer: Entry price? Stop-loss? Target? Risk amount? Setup quality (A/B/C)? If you can\'t answer clearly, don\'t trade. This 30-second pause interrupts emotional impulses.',
      },
      {
        title: 'Implement Mandatory Trade Journaling (Start Tomorrow)',
        description:
          'After every trade (win or loss), write: What emotion did I feel? Did I follow my rules? What would I do differently? This builds self-awareness—the first step to emotional control.',
      },
      {
        title: 'Create "Cool-Down" Rules (After Your Next Loss)',
        description:
          'After any loss: no trades for 1 hour minimum. Walk away. Get coffee. This single rule prevents 80% of revenge trades. Your worst losses come in emotional spirals, not from single trades.',
      },
      {
        title: 'Risk Per Trade Maximum (Implement This Week)',
        description:
          "Never risk more than 1-2% of your account per trade. This removes the emotional weight. When losses don't hurt badly, you don't trade emotionally to recover them.",
      },
      {
        title: 'Consider Rule-Based Automation (Next 2 Weeks)',
        description:
          "Explore automated trading solutions that execute strategies without emotion. Even if you don't use full automation, studying how bots remove emotion will teach you to trade more systematically.",
      },
    ],
    transformSection: {
      intro:
        "The best traders with your personality type don't \"master their emotions\"—they design systems that make emotions irrelevant.",
      whatTheyDo: [
        'They use automation or semi-automation to remove decision-making in the moment',
        'They pre-commit to trades with alerts and limit orders, never market orders during volatility',
        'They trade smaller position sizes so emotions stay calm',
        'They focus on process (did I follow my rules?) not outcomes (did I make money today?)',
      ],
      automationAdvantage:
        'Many formerly emotional traders discover that automated trading solutions transform their results. When a proven strategy executes automatically based on data—not fear or greed—emotions can\'t sabotage you. You define the rules once when thinking clearly, and the system executes them perfectly every time.',
    },
    nextSteps: {
      bookTitle: 'Trading in the Zone',
      bookAuthor: 'Mark Douglas',
      ctaHeadline: 'Ready to Remove Emotion From Your Trading?',
      ctaDescription:
        'Discover how our automated trading bot executes proven strategies 24/7 without fear, greed, or FOMO.',
    },
  },
  time_starved_trader: {
    type: 'time_starved_trader',
    name: 'The Time-Starved Trader',
    emoji: '⏰',
    tagline: 'You need a solution that works while you sleep',
    color: '#49ACF2',
    bgGradient: 'from-blue-dark to-blue-light',
    shortDescription:
      "You understand trading potential, but your busy life prevents you from capitalizing on opportunities. Missing market moves while you sleep or work is frustrating—but it doesn't have to be this way.",
    quickTip:
      "Focus on trading strategies that don't require constant monitoring. Set alerts for key levels, or explore automation that works 24/7 while you focus on your life.",
    personalityDescription:
      "You understand that trading offers real potential, but your biggest enemy isn't lack of knowledge—it's lack of time. You have a job, a business, a family, or other commitments that demand your attention. Markets don't care about your schedule.\n\nYou've experienced the frustration: checking charts during lunch breaks, waking up to missed opportunities, setting alerts that go off during meetings. You watch other traders celebrate wins on setups you spotted but couldn't execute.",
    whyThisCategory:
      "Your quiz responses show that time scarcity is your primary barrier to trading success. You can't watch markets 24/7, and crypto's global, always-on nature means the best moves often happen while you're sleeping, working, or living your life.\n\nThis isn't a flaw in your trading—it's a flaw in your trading approach. You need strategies and systems designed for people who have lives beyond the charts.",
    challenges: [
      {
        title: 'Missing Prime Opportunities',
        description:
          'You analyze a setup, plan your entry, but you\'re busy when it triggers. By the time you check charts again, the move happened without you.',
      },
      {
        title: '24/7 Market FOMO',
        description:
          "Crypto never sleeps. Asian session moves, European open volatility, US market correlations—opportunities exist around the clock. You can't be present for all of them.",
      },
      {
        title: 'Rushed Decisions',
        description:
          'The little time you have for trading is fragmented—checking charts quickly between meetings or before bed. Rushed analysis leads to poor entries.',
      },
      {
        title: 'Incomplete Execution',
        description:
          "You enter a trade but can't monitor it. You set a stop-loss but miss the optimal exit. Partial execution leaves money on the table.",
      },
    ],
    strengths: [
      {
        title: 'Strategic Thinking',
        description:
          "Because you can't watch charts constantly, you think more strategically. You look for quality setups rather than overtrading.",
      },
      {
        title: 'Emotional Distance',
        description:
          "Not watching every price tick actually helps. You're less likely to panic sell or FOMO into tops because you're not glued to the charts.",
      },
      {
        title: 'Life Balance',
        description:
          'You have priorities beyond trading, which is healthy. Many full-time traders burn out. Your balanced approach is sustainable long-term.',
      },
    ],
    improvementSteps: [
      {
        title: 'Switch to Higher Timeframes (This Week)',
        description:
          'Stop trying to day-trade with limited time. Focus on 4H/daily charts for swing trades that don\'t require constant monitoring.',
      },
      {
        title: 'Master Limit Orders & Alerts (Start Today)',
        description:
          'Stop market ordering. Set limit orders at your planned entry with stop-loss and take-profit built in. Let the market come to you.',
      },
      {
        title: 'Define Your "Trading Windows" (This Week)',
        description:
          'Choose 2-3 specific times per day to check markets. Do your analysis then, set orders, and walk away.',
      },
      {
        title: 'Simplify Your Strategy (Next Week)',
        description:
          'Complex strategies require constant monitoring. Use simple, objective setups you can identify in 5 minutes and execute with limit orders.',
      },
      {
        title: 'Explore 24/7 Automated Solutions (Next 2 Weeks)',
        description:
          'Research automated trading systems that work while you sleep. Even if you don\'t go fully automated, understanding how to systematize execution will transform your trading.',
      },
    ],
    transformSection: {
      intro:
        "The best traders with limited time don't try to compete with full-time chart watchers—they build systems that work independently of their attention.",
      whatTheyDo: [
        'They use automation to execute strategies 24/7 without manual monitoring',
        'They focus on swing trading (multi-day holds) not day trading',
        'They rely heavily on limit orders, alerts, and pre-planned trades',
        "They accept they'll miss some opportunities and focus on catching the ones that matter",
      ],
      automationAdvantage:
        "Many time-starved traders find that automated trading is the solution they needed all along. Instead of trying to be available 24/7, they define a proven strategy once and let it run continuously. The bot watches markets, identifies setups, enters positions, manages risk, and takes profits—all while they focus on their career, family, and life.",
    },
    nextSteps: {
      bookTitle: 'The 4-Hour Work Week',
      bookAuthor: 'Tim Ferriss',
      ctaHeadline: 'Ready to Trade 24/7 Without Watching Charts?',
      ctaDescription:
        'Our automated trading bot executes proven strategies around the clock—capturing opportunities while you sleep, work, and live your life.',
    },
  },
  inconsistent_executor: {
    type: 'inconsistent_executor',
    name: 'The Inconsistent Executor',
    emoji: '⚡',
    tagline: 'You know what to do—you just need consistent execution',
    color: '#E0C145',
    bgGradient: 'from-[#E0C145] to-[#FFC440]',
    shortDescription:
      "You have the knowledge and strategy, but execution is your Achilles heel. You know what to do but struggle to follow through consistently. Great news: discipline is a system problem, not a willpower problem.",
    quickTip:
      "Stop relying on discipline. Create forcing mechanisms—journal every trade before taking it, use alerts instead of watching charts, or automate your strategy completely.",
    personalityDescription:
      "You're one of the most frustrating types of trader—because you know what to do. You've studied strategies, you understand risk management, you can spot good setups. Your problem isn't knowledge. It's execution.\n\nYou set rules and break them. You plan trades and second-guess yourself. You backtest strategies and don't follow them live. The gap between what you know you should do and what you actually do is costing you consistent profits.",
    whyThisCategory:
      "Your quiz responses reveal that discipline and consistency are your primary barriers. You have a plan but don't stick to it. You know your rules but break them in the moment. This isn't about intelligence or knowledge—it's about execution systems.\n\nThe good news? This is a systematic problem with systematic solutions. You don't need more knowledge; you need better systems that ensure you follow through.",
    challenges: [
      {
        title: 'Rule-Breaking in the Moment',
        description:
          'You set a stop-loss but move it when price approaches, hoping it reverses. You promise to only trade A+ setups but take mediocre ones out of impatience.',
      },
      {
        title: 'Hesitation on Good Setups',
        description:
          'You spot a perfect setup matching your strategy, but you hesitate. "Is this really it?" By the time you decide, the opportunity has moved.',
      },
      {
        title: 'Backtesting vs. Live Trading Gap',
        description:
          "Your strategy looks great in backtests, but live trading is different. Emotions kick in, you tweak entries, you exit early. The strategy isn't the problem—your inconsistent execution ruins it.",
      },
      {
        title: 'Starting Strong, Finishing Weak',
        description:
          "You begin with discipline: journaling, following rules, proper risk management. But after a few losses or a winning streak, discipline slips. You can't maintain consistency over weeks and months.",
      },
    ],
    strengths: [
      {
        title: 'Knowledge & Understanding',
        description:
          "You've put in the work to learn. You understand strategies, risk management, and what good trading looks like. This foundation is more than most traders have.",
      },
      {
        title: 'Self-Awareness',
        description:
          "You recognize your inconsistency, which means you're not in denial. Many traders blame the market or their strategy. You know the problem is execution.",
      },
      {
        title: 'Capability',
        description:
          "When you execute properly, you succeed. You've had winning streaks when you followed your rules. This proves you have a viable approach—you just need consistency.",
      },
    ],
    improvementSteps: [
      {
        title: 'Remove Discretion Wherever Possible (This Week)',
        description:
          'Every point of discretion is a point of failure. Use limit orders at exact levels. Define exact entry criteria. Discretion = inconsistency.',
      },
      {
        title: 'Trade Smaller to Remove Pressure (Start Tomorrow)',
        description:
          "If you're risking 5% per trade, pressure causes hesitation and rule-breaking. Drop to 0.5-1% per trade. When losses don't hurt badly, you'll execute calmly.",
      },
      {
        title: 'Create Forcing Mechanisms (This Week)',
        description:
          "Don't rely on willpower. Screenshot your setup BEFORE entering. Set stop-loss immediately after entry. Use a trading partner for accountability.",
      },
      {
        title: 'Track Process, Not Outcomes (Start Today)',
        description:
          'Stop measuring success by P&L. Measure: "Did I follow my rules?" Create a checklist for every trade. Score yourself on execution, not profit.',
      },
      {
        title: 'Seriously Consider Full Automation (Next 2 Weeks)',
        description:
          "If you know what to do but can't consistently do it, automation solves your exact problem. Define your strategy once, let it execute with perfect consistency.",
      },
    ],
    transformSection: {
      intro:
        "The best traders with your personality type realize that discipline isn't a personality trait—it's a system design problem.",
      whatTheyDo: [
        'They remove human decision-making at execution time through automation',
        'They use extreme position sizing (tiny risk) to remove emotional pressure',
        'They treat trading like a business process: checklists, systems, forcing mechanisms',
        "They accept that willpower fails and build systems that don't require it",
      ],
      automationAdvantage:
        "Your type benefits most from automation. You have the knowledge and strategy—you just need consistent execution. Automated trading systems execute your rules with perfect discipline, every time. No hesitation on good setups. No breaking stop-losses. No second-guessing.",
    },
    nextSteps: {
      bookTitle: 'Atomic Habits',
      bookAuthor: 'James Clear',
      ctaHeadline: 'Ready for Perfect Execution Every Time?',
      ctaDescription:
        'Our automated trading bot follows proven strategies with 100% consistency. No hesitation, no rule-breaking, no emotional decisions.',
    },
  },
  overwhelmed_analyst: {
    type: 'overwhelmed_analyst',
    name: 'The Overwhelmed Analyst',
    emoji: '📊',
    tagline: 'You need less information, not more',
    color: '#5BD69F',
    bgGradient: 'from-[#5BD69F] to-[#8ACEFE]',
    shortDescription:
      "You're drowning in information, indicators, and conflicting advice. By the time you analyze everything, the opportunity is gone. What you need isn't more information—it's clarity and simplification.",
    quickTip:
      'Pick ONE strategy and master it. Remove all indicators except 2-3 essential ones. More analysis doesn\'t equal better results—focused execution does.',
    personalityDescription:
      "You're drowning in information. Twenty indicators on your charts. Fifty trading educators in your feed. Conflicting strategies, contradictory advice, endless analysis. By the time you've analyzed everything, the opportunity is gone.\n\nYour problem isn't lack of effort—it's too much effort in the wrong direction. You think more analysis equals better trading. It doesn't. More information creates paralysis, not profit.",
    whyThisCategory:
      "Your quiz responses show that information overload and analysis paralysis are your primary barriers. You consume endless content but struggle to make clear decisions. You overthink entries, second-guess yourself, and feel confused about what actually works.\n\nThe path forward isn't more knowledge. It's ruthless simplification and focus. You need less information, not more.",
    challenges: [
      {
        title: 'Analysis Paralysis',
        description:
          "You spot a potential setup, but then you check one more indicator, one more timeframe, one more opinion. By the time you've \"confirmed\" everything, price has moved.",
      },
      {
        title: 'Conflicting Information',
        description:
          "One educator says trend-following is best. Another swears by mean reversion. You're stuck in the middle, unable to commit to any approach.",
      },
      {
        title: 'Chart Clutter',
        description:
          'Your charts are covered in indicators: RSI, MACD, Bollinger Bands, Moving Averages. You think this gives you more edge. Instead, it creates confusion.',
      },
      {
        title: 'Overthinking Every Decision',
        description:
          "Should you enter now or wait? Is this the bottom? Should you take profit or let it run? Every decision triggers more analysis, more research, more doubt. You're exhausted by your own mind.",
      },
    ],
    strengths: [
      {
        title: 'Research-Oriented',
        description:
          "Your willingness to learn is admirable. Most traders don't put in 10% of the study effort you do. This foundation is valuable—once you learn to focus it.",
      },
      {
        title: 'Risk-Aware',
        description:
          "Your hesitation comes from awareness of risk. You don't blindly jump into trades. This caution, when balanced with action, will protect your capital.",
      },
      {
        title: 'Analytical Mind',
        description:
          'Your ability to analyze is powerful. The problem is application, not capability. Once you channel this toward a focused approach, you\'ll excel.',
      },
    ],
    improvementSteps: [
      {
        title: 'Strategy Monogamy (This Week)',
        description:
          'Pick ONE strategy and commit to it for 3 months minimum. No strategy-hopping. One strategy, deep focus, full commitment.',
      },
      {
        title: 'Radical Chart Simplification (Today)',
        description:
          'Remove every indicator except 2-3 maximum. Price action + one momentum indicator + volume. If you can\'t make decisions with three tools, ten won\'t help.',
      },
      {
        title: 'Unfollow 90% of Trading Content (This Week)',
        description:
          'Unfollow, unsubscribe, and mute 90% of trading educators and influencers. Keep 2-3 maximum who align with your chosen strategy.',
      },
      {
        title: 'Set "Analysis Time Limits" (Start Tomorrow)',
        description:
          'Give yourself 5 minutes to analyze a setup. Set a timer. At 5 minutes, decide: trade or no trade. This forces decisive action.',
      },
      {
        title: 'Explore Systematic/Automated Approaches (Next 2 Weeks)',
        description:
          'Research rule-based trading systems and automation. These remove subjective analysis entirely. Proven algorithms trade on objective criteria.',
      },
    ],
    transformSection: {
      intro:
        "The best traders with your personality type don't \"master complexity\"—they embrace brutal simplification.",
      whatTheyDo: [
        'They use automation or systematic approaches that eliminate subjective analysis',
        'They focus on one simple strategy and execute it repeatedly',
        'They limit information intake dramatically',
        'They value speed of execution over perfect analysis',
      ],
      automationAdvantage:
        "Many overwhelmed analysts discover that automated trading is the clarity they needed. Instead of analyzing 20 indicators and conflicting opinions, a proven algorithm executes based on objective, backtested criteria. No overthinking. No second-guessing. No information overload.",
    },
    nextSteps: {
      bookTitle: 'Essentialism',
      bookAuthor: 'Greg McKeown',
      ctaHeadline: 'Ready to Escape Analysis Paralysis?',
      ctaDescription:
        'Our automated trading bot follows a proven, backtested strategy with zero subjective analysis. Just objective, data-driven execution 24/7.',
    },
  },
};

export function getPersonalityTypeInfo(type: PersonalityType): PersonalityTypeInfo {
  return PERSONALITY_TYPES[type];
}

export function getPersonalityTypeSlug(type: PersonalityType): string {
  return type.replace(/_/g, '-');
}

export function getPersonalityTypeFromSlug(slug: string): PersonalityType | null {
  const type = slug.replace(/-/g, '_') as PersonalityType;
  if (PERSONALITY_TYPES[type]) return type;
  return null;
}
