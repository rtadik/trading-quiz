import { PersonalityType } from './scoring';
import { PERSONALITY_TYPES } from './personality-types';

type EmailTemplateFn = (firstName: string) => { subject: string; html: string };

function wrapInEmailLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a2e; margin: 0; padding: 0; background-color: #f5f5f7; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0a0f1e, #1a1f3e); padding: 30px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; }
    .body { padding: 30px; }
    .body p { margin: 0 0 16px; color: #374151; }
    .body blockquote { border-left: 3px solid #3b82f6; padding-left: 16px; margin: 16px 0; color: #6b7280; font-style: italic; }
    .cta { display: inline-block; background: linear-gradient(135deg, #2563eb, #06b6d4); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 16px 0; }
    .footer { padding: 20px 30px; background: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    ul { padding-left: 20px; }
    ul li { margin-bottom: 8px; color: #374151; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Trading Personality Quiz</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>${process.env.SENDER_NAME || 'Trading Quiz'}<br>Helping traders improve their results</p>
    </div>
  </div>
</body>
</html>`;
}

// ============================================================
// EMOTIONAL TRADER EMAILS
// ============================================================

const emotionalTraderEmails: EmailTemplateFn[] = [
  // Email 1: Immediate - PDF Delivery
  (firstName) => ({
    subject: `Your Trading Personality Report is Here, ${firstName}! 🎭`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Your Trading Personality Report is ready!</p>
      <p>Based on your quiz responses, you're an <strong>EMOTIONAL TRADER</strong> 🎭</p>
      <p>This means your biggest enemy isn't the market—it's the emotions you bring to it. FOMO, fear, and impulsive decisions are costing you consistent profits.</p>
      <p>But here's the good news: This is one of the <strong>easiest problems to fix</strong> with the right system.</p>
      <p>Your detailed report includes:</p>
      <ul>
        <li>Why you fall into the Emotional Trader category</li>
        <li>Your 4 biggest challenges (and the real reason they keep happening)</li>
        <li>Your hidden strengths that most traders don't have</li>
        <li>A 5-step improvement plan you can start TODAY</li>
        <li>How successful emotional traders transform their results</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/emotional-trader?name=${encodeURIComponent(firstName)}" class="cta">Download Your Report (PDF)</a></p>
      <p>Over the next two weeks, I'll be sending you specific strategies, real stories from other emotional traders, and a solution that's helped hundreds of traders just like you.</p>
      <hr class="divider">
      <p>P.S. - Want to connect with other traders? <a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}">Join our community</a></p>
    `),
  }),
  // Email 2: Day 1 - The Real Problem
  (firstName) => ({
    subject: `${firstName}, here's why FOMO keeps destroying your account...`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Quick question:</p>
      <p>Remember that trade last week (or month) where you saw a coin pumping on Twitter, everyone was talking about it, and you jumped in without a plan?</p>
      <p>You knew you shouldn't have. No stop-loss. No clear strategy. No risk management.</p>
      <p>But the FOMO was overwhelming. <em>"Everyone else is making money RIGHT NOW..."</em></p>
      <p>So you bought in. And if you're like most emotional traders, you bought near the top.</p>
      <p>Here's what you need to understand:</p>
      <blockquote>This isn't your fault.</blockquote>
      <p>Markets are DESIGNED to trigger these emotions. Pumps happen fast, creating urgency. Social media amplifies FOMO. Professional traders know this and profit from it.</p>
      <p>The traders who win consistently aren't more disciplined than you. They've just <strong>removed the OPPORTUNITY for emotion to interfere</strong> with their trading.</p>
      <p>I'll show you exactly how they do it in my next email.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 3: Day 3 - Why Traditional Solutions Fail
  (firstName) => ({
    subject: `Why "just be disciplined" doesn't work for Emotional Traders`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>If you've ever read a trading book, you've heard this advice: "Just follow your rules." "Don't let emotions control you." "Be disciplined."</p>
      <p>Except it doesn't work. Here's why:</p>
      <p>Discipline is a <strong>FINITE RESOURCE</strong>. It works great when you're calm. But what happens when:</p>
      <ul>
        <li>You've had three losses in a row and you're desperate to recover?</li>
        <li>You see a coin pumping 40% and everyone's celebrating?</li>
        <li>Fear kicks in screaming "TAKE PROFIT NOW"?</li>
      </ul>
      <p>In those moments, discipline evaporates. Because you're fighting millions of years of human evolution. Fear and greed are <strong>HARDWIRED</strong> into your brain.</p>
      <p>The traders who consistently win don't rely on discipline. They rely on <strong>SYSTEMS</strong> that make discipline irrelevant.</p>
      <p>Some examples:</p>
      <ul>
        <li>Using alerts and limit orders so they never "decide" in the heat of the moment</li>
        <li>Trading position sizes so small that losses don't trigger emotional spirals</li>
        <li>Automating their strategy entirely so there's no human in the loop</li>
      </ul>
      <p>I'll show you how in my next email, plus real stories from emotional traders who transformed their results.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 4: Day 5 - The New Way (Automation)
  (firstName) => ({
    subject: `How Emotional Traders are winning with automation`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Let me introduce you to Sarah. She's an Emotional Trader, just like you.</p>
      <p>Last year, her trading account told a painful story: down $3,200 over 4 months. FOMO entries, revenge trading, panic selling winners.</p>
      <p>She knew what to do—she'd taken courses, read books, had a solid strategy. Her problem was execution.</p>
      <p>Then she tried something different. She took her proven strategy and <strong>automated it</strong>.</p>
      <p>Here's what happened:</p>
      <ul>
        <li>Month 1: +$340</li>
        <li>Month 2: +$780</li>
        <li>Month 3: +$1,120</li>
        <li>Month 4: +$840</li>
      </ul>
      <p>Not every month was perfect. But the system followed the rules <strong>EVERY. SINGLE. TIME.</strong></p>
      <p>No FOMO entries. No revenge trading. No panic exits. No broken stop-losses.</p>
      <p>Sarah didn't become more disciplined. She <strong>removed the need for discipline</strong>.</p>
      <p>In my next email, I'll show you exactly how this works and how you can get started.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 5: Day 7 - How It Works
  (firstName) => ({
    subject: `Behind the scenes: How our bot removes emotion from trading`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>You asked (or you're wondering): "How does automated trading actually work?"</p>
      <p><strong>THE OLD WAY (What You're Doing Now):</strong></p>
      <p>Research strategies → Backtest → Trade live → Emotions interfere → Break rules → Blame the strategy → Start over.</p>
      <p><strong>THE NEW WAY (Automation):</strong></p>
      <ul>
        <li>Proven strategy already developed and backtested by professionals</li>
        <li>Algorithm executes it 24/7 with zero emotion</li>
        <li>You stake our token to get access</li>
        <li>You receive daily USDT returns automatically</li>
      </ul>
      <p><strong>How it fixes your Emotional Trader problem:</strong></p>
      <ul>
        <li>FOMO entries → The bot doesn't have FOMO. It enters based on data.</li>
        <li>Panic exits → The bot doesn't panic. It exits at predetermined levels.</li>
        <li>Revenge trading → The bot doesn't feel revenge. It follows the plan.</li>
        <li>Breaking stop-losses → The bot never breaks rules. Ever.</li>
      </ul>
      <p>Want to see the performance data? Reply "SHOW ME" and I'll send you the details.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 6: Day 10 - Social Proof
  (firstName) => ({
    subject: `From Emotional Trader to Consistent Profits: Michael's Story`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Michael traded for 2 years. Read every book, took 3 courses, had a solid strategy. In reality? Down $4,500 overall. His problem? Emotional execution.</p>
      <p>After another -$800 month, he decided to try automation with a small amount.</p>
      <p><strong>Month 1:</strong> +$340 — First green month in 6 months.</p>
      <p><strong>Month 2:</strong> +$780</p>
      <p><strong>Month 3-4:</strong> +$1,120 and +$840</p>
      <p>His realization: <em>"My 'trading instincts' were just emotional reactions. The bot wasn't smarter than me. It was just more disciplined."</em></p>
      <p>Now 80% of his capital runs automated—consistent, emotionless, profitable. 20% he plays with manually for enjoyment.</p>
      <p><strong>The question for you:</strong> How much longer are you going to fight your emotions?</p>
      <p><a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}" class="cta">See How It Works</a></p>
      <p>Talk soon</p>
    `),
  }),
  // Email 7: Day 14 - Objection Handling
  (firstName) => ({
    subject: `"Is automated trading really safe?" Here's the honest truth...`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Let me address the big concerns directly:</p>
      <p><strong>"I'll lose control of my money"</strong> — You have MORE control, not less. You control how much you stake, can unstake anytime, and receive daily returns you can withdraw.</p>
      <p><strong>"What if the bot loses money?"</strong> — It will sometimes. That's trading. The difference? It loses with controlled risk, following rules exactly, without emotional spiraling.</p>
      <p><strong>"This sounds too good to be true"</strong> — It's not magic. It's just better execution. Your strategy executed the way it's supposed to be—every single time.</p>
      <p><strong>"I don't understand the technology"</strong> — You don't need to. Stake the token → Get access → Receive daily USDT. That's it.</p>
      <p><strong>The real question isn't "Is this perfect?"</strong> — it's "Is this better than what I'm doing now?"</p>
      <p>If you're losing money to emotional decisions, the answer is yes.</p>
      <p><a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}" class="cta">Learn More</a></p>
      <p>Talk soon</p>
    `),
  }),
  // Email 8: Day 17 - Final CTA
  (firstName) => ({
    subject: `${firstName}, let's fix your Emotional Trading problem`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>We've been talking for over two weeks now. You've learned why you're an Emotional Trader, why discipline fails, and how automation removes emotion from the equation.</p>
      <p>Now it's decision time.</p>
      <p><strong>Option A:</strong> Keep doing what you're doing — manual trading with the same emotional challenges. In 6 months, you'll likely be in the same place.</p>
      <p><strong>Option B:</strong> Try something different — remove emotional decision-making, let proven strategies execute consistently. In 6 months, you could have actual profits.</p>
      <p><strong>For quiz takers like you, we have a special offer:</strong></p>
      <ul>
        <li>Priority onboarding (skip the waitlist)</li>
        <li>1-on-1 setup assistance</li>
        <li>Access to our private Emotional Traders support group</li>
        <li>First month performance tracking and optimization</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}" class="cta">Book Your Onboarding Call</a></p>
      <p>If you're not ready yet, that's totally fine. Stay on this list—we'll keep sending valuable content.</p>
      <p>Talk soon</p>
      <hr class="divider">
      <p><em>P.S. - The biggest risk isn't trying automation. The biggest risk is doing the same thing for another 6 months and getting the same results.</em></p>
    `),
  }),
];

// ============================================================
// TIME-STARVED TRADER EMAILS
// ============================================================

const timeStarvedTraderEmails: EmailTemplateFn[] = [
  // Email 1: Immediate - PDF Delivery
  (firstName) => ({
    subject: `Your Trading Personality Report is Here, ${firstName}! ⏰`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Your Trading Personality Report is ready!</p>
      <p>Based on your quiz responses, you're a <strong>TIME-STARVED TRADER</strong> ⏰</p>
      <p>This means your biggest barrier isn't lack of knowledge—it's lack of time. Markets don't care about your schedule, and the best moves often happen while you're sleeping or working.</p>
      <p>But here's the good news: this is a <strong>solvable problem</strong>.</p>
      <p>Your detailed report includes:</p>
      <ul>
        <li>Why you fall into the Time-Starved Trader category</li>
        <li>Your 4 biggest time-related challenges</li>
        <li>Your hidden strengths (yes, being busy has advantages)</li>
        <li>A 5-step plan to trade effectively with limited time</li>
        <li>How successful busy traders win</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/time-starved-trader?name=${encodeURIComponent(firstName)}" class="cta">Download Your Report (PDF)</a></p>
      <p>Over the next two weeks, I'll be sending you specific strategies designed for busy traders like you.</p>
      <hr class="divider">
      <p>P.S. - Want to connect with other busy traders? <a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}">Join our community</a></p>
    `),
  }),
  // Email 2: Day 1 - The Real Problem
  (firstName) => ({
    subject: `${firstName}, how many moves did you miss this week while working?`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Quick question: How many times this month have you woken up, checked your phone, and seen that the perfect setup you identified... triggered while you were sleeping?</p>
      <p>If you're like most Time-Starved Traders, this happens multiple times per week.</p>
      <p>It's frustrating because you KNEW the opportunity was there. You just couldn't execute.</p>
      <p>Here's the truth most people won't tell you:</p>
      <blockquote>You can't compete with full-time traders on availability. And you shouldn't try.</blockquote>
      <p>Trying to day-trade with a full-time job is like trying to run a marathon while carrying a backpack full of rocks. You can do it, but you're at a massive disadvantage.</p>
      <p>The traders who win with limited time don't try harder—they <strong>trade smarter</strong>.</p>
      <p>I'll show you exactly what that means in my next email.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 3: Day 3 - Why Traditional Solutions Fail
  (firstName) => ({
    subject: `Why "setting alerts" isn't enough for Time-Starved Traders`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>The common advice for busy traders is: "Just set alerts and check during breaks."</p>
      <p>The problem? Even with alerts:</p>
      <ul>
        <li>You're in a meeting when the alert fires</li>
        <li>By the time you check, the move already happened</li>
        <li>Your "quick trade" during lunch becomes a distracted mess</li>
        <li>You set limit orders but can't adjust when conditions change</li>
      </ul>
      <p>Alerts help, but they don't solve the fundamental problem: <strong>crypto markets run 24/7 and you can't be available 24/7.</strong></p>
      <p>The traders who solve this don't try to be more available. They build systems that <strong>don't need them to be present at all</strong>.</p>
      <p>Some use swing trading on higher timeframes. Some use advanced limit orders. And the most successful ones? They automate entirely.</p>
      <p>More on that in my next email.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 4: Day 5 - The New Way
  (firstName) => ({
    subject: `How Time-Starved Traders are finally catching the moves they miss`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Meet James. Nurse with 12-hour shifts. He was missing 90% of crypto moves because he literally couldn't look at charts during work.</p>
      <p>He tried everything: alerts, limit orders, trading only on days off. Nothing worked consistently.</p>
      <p>Then he discovered automated trading. His bot now:</p>
      <ul>
        <li>Monitors markets while he's on shift</li>
        <li>Executes strategies during Asian session while he sleeps</li>
        <li>Catches opportunities he'd have missed 100% of the time</li>
        <li>Manages risk without him touching his phone</li>
      </ul>
      <p>Result? Last quarter: consistent returns while working his regular job. Zero missed opportunities due to "bad timing."</p>
      <p>This isn't about being lazy. It's about being smart. Why compete in an area where you're disadvantaged (time) when you can use systems that make time irrelevant?</p>
      <p>In my next email, I'll show you exactly how this works.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 5: Day 7 - How It Works
  (firstName) => ({
    subject: `Here's how our bot trades while you sleep, work, and live your life`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p><strong>How it works:</strong></p>
      <ul>
        <li>You stake our token (this gives you access to the bot)</li>
        <li>The bot trades 24/7 across multiple markets using proven algorithms</li>
        <li>You receive daily USDT deposited directly to your wallet</li>
        <li>No trading decisions required from you</li>
      </ul>
      <p><strong>What this means for your time problem:</strong></p>
      <ul>
        <li>Asian session at 3 AM? Bot's trading.</li>
        <li>European open while you're commuting? Bot's trading.</li>
        <li>Weekend volatility while you're with family? Bot's trading.</li>
        <li>Busy day at work, no time to check charts? Bot's trading.</li>
      </ul>
      <p>You go from catching 10-20% of opportunities (the ones that happen during your free time) to capturing opportunities across <strong>every session, every day</strong>.</p>
      <p>Want to see the performance data? Reply "SHOW ME" and I'll send details.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 6: Day 10 - Social Proof
  (firstName) => ({
    subject: `"I finally stopped missing moves" - A Time-Starved Trader's story`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Sarah is a software engineer. 50-hour work weeks. By the time she'd check charts after work, the moves were over.</p>
      <p>Sound familiar?</p>
      <p>After switching to automated trading:</p>
      <ul>
        <li>She doesn't check charts during work anymore</li>
        <li>Her portfolio runs 24/7 without intervention</li>
        <li>She reviews performance once a week (takes 5 minutes)</li>
        <li>She spends her evenings with family instead of staring at charts</li>
      </ul>
      <p><em>"The best part isn't the returns—it's getting my time back. I was spending 2-3 hours a day on trading and missing most opportunities anyway. Now the bot handles it and I have my life back."</em></p>
      <p>Want to get your time back too?</p>
      <p><a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}" class="cta">See How It Works</a></p>
      <p>Talk soon</p>
    `),
  }),
  // Email 7: Day 14 - Objection Handling
  (firstName) => ({
    subject: `"But I want to be a real trader..." Here's the truth`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Let me address the most common concerns from Time-Starved Traders:</p>
      <p><strong>"I want to learn to trade myself"</strong> — Great! Keep learning. But while you're learning, why not have a system generating returns? You can always trade manually when you're ready.</p>
      <p><strong>"What if I get more free time later?"</strong> — Even full-time traders use automation. More time doesn't mean manual is better—it just means you have time to oversee automated systems.</p>
      <p><strong>"How do I know it's working if I'm not watching?"</strong> — Daily USDT deposits to your wallet. Weekly performance reports. You verify results without monitoring every trade.</p>
      <p><strong>"What about risk?"</strong> — You control your stake size. Start small. See results. Scale up when comfortable.</p>
      <p>The question isn't whether automation can help you. It's how much longer you'll miss opportunities while you're busy living your life.</p>
      <p><a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}" class="cta">Learn More</a></p>
      <p>Talk soon</p>
    `),
  }),
  // Email 8: Day 17 - Final CTA
  (firstName) => ({
    subject: `${firstName}, stop missing moves. Here's your next step.`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Over the past two weeks, you've learned why being time-starved is your biggest trading barrier and how automation solves it completely.</p>
      <p>Every day you wait is another day of missed opportunities. Markets are moving right now—while you read this email. Are you capturing those moves?</p>
      <p><strong>For quiz takers like you:</strong></p>
      <ul>
        <li>Priority onboarding</li>
        <li>1-on-1 setup assistance</li>
        <li>Access to our Time-Starved Traders support group</li>
        <li>First month performance tracking</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}" class="cta">Book Your Onboarding Call</a></p>
      <p>Not ready yet? That's fine. But remember: the market doesn't wait for you to be available.</p>
      <p>Talk soon</p>
    `),
  }),
];

// ============================================================
// INCONSISTENT EXECUTOR EMAILS
// ============================================================

const inconsistentExecutorEmails: EmailTemplateFn[] = [
  // Email 1: Immediate - PDF Delivery
  (firstName) => ({
    subject: `Your Trading Personality Report is Here, ${firstName}! ⚡`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Your Trading Personality Report is ready!</p>
      <p>Based on your quiz responses, you're an <strong>INCONSISTENT EXECUTOR</strong> ⚡</p>
      <p>This means you have the knowledge and strategy, but execution is your Achilles heel. You know what to do—the gap is in actually doing it consistently.</p>
      <p>The good news? <strong>Discipline is a system problem, not a willpower problem.</strong></p>
      <p>Your report includes:</p>
      <ul>
        <li>Why you fall into the Inconsistent Executor category</li>
        <li>Your 4 biggest execution challenges</li>
        <li>Your hidden strengths (you're more capable than you think)</li>
        <li>A 5-step plan to close the execution gap</li>
        <li>How successful executors transform their consistency</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/inconsistent-executor?name=${encodeURIComponent(firstName)}" class="cta">Download Your Report (PDF)</a></p>
      <p>Over the next two weeks, I'll share strategies specifically designed for traders who know what to do but struggle to do it.</p>
      <hr class="divider">
      <p>P.S. - Connect with others solving the same problem: <a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}">Join our community</a></p>
    `),
  }),
  // Email 2: Day 1
  (firstName) => ({
    subject: `${firstName}, the gap between what you know and what you do is costing you...`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>You know the feeling. You've backtested a strategy. It works. You've written the rules. They're solid.</p>
      <p>Then the market opens and it all falls apart.</p>
      <p>You set a stop-loss at -3%... but when price approaches, you move it. <em>"Just a little more room."</em></p>
      <p>You spot a perfect A+ setup... but you hesitate. <em>"What if this time is different?"</em> By the time you decide, it's gone.</p>
      <p>Here's the painful truth: <strong>Your strategy isn't the problem. You are.</strong></p>
      <p>But not in the way you think. It's not that you're weak or undisciplined. It's that you're trying to use willpower to do something that requires systems.</p>
      <p>Would you trust yourself to manually calculate your taxes every month without software? No—you'd use a system. Trading should be the same.</p>
      <p>More on this in my next email.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 3: Day 3
  (firstName) => ({
    subject: `Why willpower always fails for Inconsistent Executors`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Every time you promise "this time I'll follow my rules," you're making the same mistake: relying on willpower.</p>
      <p>Research shows willpower is like a battery—it depletes with use. After a few losses, a long day at work, or a winning streak that makes you overconfident, your willpower is at zero.</p>
      <p>That's exactly when you need discipline most. And exactly when you don't have it.</p>
      <p>The solution isn't more willpower. It's <strong>removing the need for willpower entirely</strong>.</p>
      <ul>
        <li>Don't "decide" to set a stop-loss → Make it automatic</li>
        <li>Don't "try" to follow entry rules → Remove discretion from entries</li>
        <li>Don't "promise" to journal → Build systems that force accountability</li>
      </ul>
      <p>The best executors don't have more discipline. They have better systems.</p>
      <p>I'll show you the ultimate system in my next email.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 4: Day 5
  (firstName) => ({
    subject: `The Inconsistent Executor's secret weapon: removing yourself from the equation`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Here's an uncomfortable truth: <strong>You are the weakest link in your trading system.</strong></p>
      <p>Your strategy works. Your rules are sound. The only thing that fails is your execution. So what if you could keep your strategy but remove the human error?</p>
      <p>That's exactly what automation does.</p>
      <p>Meet David. Same problem as you—great strategy, terrible execution. After 18 months of inconsistency, he automated his rules.</p>
      <p>The result? His automated system followed his rules with 100% consistency. No hesitation. No rule-breaking. No "just this once."</p>
      <p>His strategy finally got to show what it could do when executed properly. And it delivered.</p>
      <p>David didn't get more disciplined. He got smarter about execution.</p>
      <p>In my next email, I'll show you exactly how this works.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 5: Day 7
  (firstName) => ({
    subject: `How our bot executes your strategy with 100% consistency`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p><strong>Here's how it works:</strong></p>
      <ul>
        <li>You stake our token (this gives you access)</li>
        <li>Proven strategies execute 24/7 with perfect consistency</li>
        <li>You receive daily USDT returns</li>
        <li>No execution decisions required from you</li>
      </ul>
      <p><strong>What this means for your execution problem:</strong></p>
      <ul>
        <li>Perfect A+ setup? Bot enters. No hesitation.</li>
        <li>Stop-loss hit? Bot exits. No moving it.</li>
        <li>Three losses in a row? Bot follows rules anyway. No tilt.</li>
        <li>Target reached? Bot takes profit. No "let it run" gambles.</li>
      </ul>
      <p>Your type benefits MOST from automation because you already have the knowledge. You just need consistent execution—and that's exactly what this provides.</p>
      <p>Reply "SHOW ME" for performance data.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 6: Day 10
  (firstName) => ({
    subject: `"I stopped fighting myself and started winning" - An Executor's story`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>David had a 67% win rate in backtests. In live trading? 41%. Same strategy, different results. The gap? Execution.</p>
      <p>He'd skip good setups out of hesitation. Move stop-losses. Exit winners early. Break his own rules "just this once."</p>
      <p>After automating:</p>
      <ul>
        <li>His strategy finally ran as designed</li>
        <li>Win rate aligned with backtests within weeks</li>
        <li>No more "I knew I should have taken that trade" moments</li>
        <li>Stress dropped dramatically</li>
      </ul>
      <p><em>"The hardest part was admitting I was the problem. Once I accepted that and let the system execute, everything changed."</em></p>
      <p>Ready to close your execution gap?</p>
      <p><a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}" class="cta">See How It Works</a></p>
      <p>Talk soon</p>
    `),
  }),
  // Email 7: Day 14
  (firstName) => ({
    subject: `"Am I giving up on becoming a better trader?" No. Here's why.`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Common concern from Inconsistent Executors: "If I automate, am I admitting defeat?"</p>
      <p><strong>No. You're admitting reality.</strong></p>
      <p>The reality is: human execution is flawed. Even the best traders in the world use systems and automation.</p>
      <p>Using automation doesn't mean you stop learning or stop being a trader. It means you use your strengths (strategy, analysis) and eliminate your weakness (inconsistent execution).</p>
      <p><strong>Other concerns:</strong></p>
      <p><strong>"What if the bot makes mistakes?"</strong> — Bots don't make execution mistakes. They might face unfavorable markets, but they never break their own rules.</p>
      <p><strong>"Can I start small?"</strong> — Absolutely. Most people start with a small stake, verify results, then scale up.</p>
      <p><strong>"What if I want to stop?"</strong> — Unstake anytime. No lock-in.</p>
      <p><a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}" class="cta">Learn More</a></p>
      <p>Talk soon</p>
    `),
  }),
  // Email 8: Day 17
  (firstName) => ({
    subject: `${firstName}, perfect execution is one step away`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>You have the knowledge. You have the strategy. The only missing piece is consistent execution.</p>
      <p>How many more months of inconsistency before you try a different approach?</p>
      <p><strong>For quiz takers like you:</strong></p>
      <ul>
        <li>Priority onboarding</li>
        <li>1-on-1 setup assistance</li>
        <li>Access to our Inconsistent Executors support group</li>
        <li>First month performance tracking</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}" class="cta">Book Your Onboarding Call</a></p>
      <p>Your strategy deserves perfect execution. Let's make it happen.</p>
      <p>Talk soon</p>
    `),
  }),
];

// ============================================================
// OVERWHELMED ANALYST EMAILS
// ============================================================

const overwhelmedAnalystEmails: EmailTemplateFn[] = [
  // Email 1: Immediate - PDF Delivery
  (firstName) => ({
    subject: `Your Trading Personality Report is Here, ${firstName}! 📊`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Your Trading Personality Report is ready!</p>
      <p>Based on your quiz responses, you're an <strong>OVERWHELMED ANALYST</strong> 📊</p>
      <p>This means you're drowning in information, indicators, and conflicting advice. By the time you analyze everything, the opportunity is gone.</p>
      <p>The good news? What you need isn't more information—it's <strong>clarity and simplification</strong>.</p>
      <p>Your report includes:</p>
      <ul>
        <li>Why you fall into the Overwhelmed Analyst category</li>
        <li>Your 4 biggest analysis challenges</li>
        <li>Your hidden strengths (your analytical mind is an asset)</li>
        <li>A 5-step simplification plan</li>
        <li>How successful analysts cut through the noise</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/api/pdf/overwhelmed-analyst?name=${encodeURIComponent(firstName)}" class="cta">Download Your Report (PDF)</a></p>
      <p>Over the next two weeks, I'll help you simplify your approach and find clarity.</p>
      <hr class="divider">
      <p>P.S. - Join others who've found clarity: <a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}">Our community</a></p>
    `),
  }),
  // Email 2: Day 1
  (firstName) => ({
    subject: `${firstName}, your 20 indicators are making you WORSE at trading...`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>How many indicators are on your charts right now? Be honest.</p>
      <p>RSI? MACD? Bollinger Bands? Moving averages? Volume profile? Fibonacci levels? Ichimoku clouds?</p>
      <p>If you're like most Overwhelmed Analysts, it's at least 5-10. Maybe more.</p>
      <p>Here's what nobody tells you: <strong>More indicators = worse decisions.</strong></p>
      <p>Why? Because indicators often contradict each other. RSI says oversold (buy!). MACD says bearish crossover (sell!). Moving average says trend up. Bollinger Bands say overbought.</p>
      <p>So you freeze. You analyze more. You look for confirmation. By the time all indicators agree... the move is over.</p>
      <p>The best traders use 2-3 tools maximum. Clarity beats complexity. Every time.</p>
      <p>I'll show you the simplification path in my next email.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 3: Day 3
  (firstName) => ({
    subject: `Why consuming more trading content is making you poorer`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>How many trading educators do you follow? YouTube channels? Twitter accounts? Discord servers?</p>
      <p>The problem with consuming endless trading content:</p>
      <ul>
        <li>Educator A says trend-following works best</li>
        <li>Educator B swears by mean reversion</li>
        <li>Educator C uses pure price action</li>
        <li>Educator D says indicators are essential</li>
      </ul>
      <p>They ALL show winning trades. They ALL sound convincing. And you're stuck in the middle trying to combine all their advice into one approach.</p>
      <p>The result? A Frankenstein strategy that doesn't work because it's built on conflicting philosophies.</p>
      <p><strong>The fix is radical simplification:</strong></p>
      <ul>
        <li>Pick ONE approach</li>
        <li>Follow ONE educator (maximum 2-3)</li>
        <li>Use ONE strategy for 3 months minimum</li>
        <li>Unfollow everyone else</li>
      </ul>
      <p>Or better yet: let a proven, backtested system make objective decisions for you. No conflicting opinions. No analysis paralysis.</p>
      <p>More on that next time.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 4: Day 5
  (firstName) => ({
    subject: `How Overwhelmed Analysts found clarity through automation`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Meet Alex. Former Overwhelmed Analyst. 15 indicators on his charts. Followed 40+ trading accounts. Analyzed for hours before every trade.</p>
      <p>Result? Missed most moves because he was still analyzing when they happened.</p>
      <p>His turning point: <em>"I realized I was using analysis as a procrastination tool. I wasn't actually trading—I was endlessly preparing to trade."</em></p>
      <p>He tried simplifying. Fewer indicators, fewer sources. But his analytical mind kept pulling him back to "just one more confirmation."</p>
      <p>Then he discovered automated trading. And it changed everything.</p>
      <p>Why? Because the bot doesn't need 15 indicators. It uses a proven, backtested algorithm with clear, objective rules. No conflicting signals. No "one more check." Just execution.</p>
      <p>For the first time, Alex's portfolio was making money instead of being analyzed to death.</p>
      <p>I'll show you how this works in my next email.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 5: Day 7
  (firstName) => ({
    subject: `Zero indicators needed: How our bot trades with pure objectivity`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p><strong>Here's how it works:</strong></p>
      <ul>
        <li>You stake our token (this gives you access)</li>
        <li>A proven algorithm trades 24/7 using objective, backtested criteria</li>
        <li>You receive daily USDT returns</li>
        <li>Zero subjective analysis required from you</li>
      </ul>
      <p><strong>What this means for your analysis paralysis:</strong></p>
      <ul>
        <li>No conflicting indicators → One proven algorithm</li>
        <li>No "one more confirmation" → Objective entry criteria</li>
        <li>No overthinking exits → Predetermined levels</li>
        <li>No information overload → Clear, data-driven decisions</li>
      </ul>
      <p>You go from spending hours analyzing and missing moves to having a system that makes objective decisions in milliseconds.</p>
      <p>The irony? Less analysis, better results.</p>
      <p>Reply "SHOW ME" for performance data.</p>
      <p>Talk soon</p>
    `),
  }),
  // Email 6: Day 10
  (firstName) => ({
    subject: `"I deleted all my indicators and tripled my returns" - Alex's story`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>Remember Alex from a few emails ago? Here's what happened after he switched to automation:</p>
      <p><strong>Before automation:</strong></p>
      <ul>
        <li>3-4 hours daily analyzing charts</li>
        <li>Missed 70% of opportunities due to analysis paralysis</li>
        <li>Constantly second-guessing every decision</li>
        <li>Exhausted and stressed</li>
      </ul>
      <p><strong>After automation:</strong></p>
      <ul>
        <li>5 minutes daily reviewing performance</li>
        <li>Bot captures opportunities across all sessions</li>
        <li>Zero subjective decisions to second-guess</li>
        <li>Relaxed and focused on other things</li>
      </ul>
      <p><em>"The mental clarity was the biggest change. I didn't realize how much energy I was spending on analysis until I stopped. Now I spend that energy on my actual life."</em></p>
      <p><a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}" class="cta">See How It Works</a></p>
      <p>Talk soon</p>
    `),
  }),
  // Email 7: Day 14
  (firstName) => ({
    subject: `"But I LIKE analyzing..." Here's why that's holding you back`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>I get it. You enjoy the analysis. The research. The deep dives. It feels productive.</p>
      <p>But here's the hard truth: <strong>analysis that doesn't lead to action is entertainment, not trading.</strong></p>
      <p>If your analysis regularly leads to trades that follow your rules, great—keep analyzing. But if you're spending hours analyzing and then either not trading or trading poorly... that analysis is a comfort zone, not an edge.</p>
      <p><strong>Other concerns:</strong></p>
      <p><strong>"I want to understand every trade"</strong> — You can still study the bot's trades. You just don't need to make the decisions in real-time.</p>
      <p><strong>"What if the algorithm is wrong?"</strong> — It will be sometimes. But it's wrong objectively, with controlled risk. You're wrong subjectively, with emotional risk on top.</p>
      <p><strong>"Can I still analyze for fun?"</strong> — Absolutely. But separate analysis-for-fun from analysis-for-profit. Let the bot handle profits.</p>
      <p><a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}" class="cta">Learn More</a></p>
      <p>Talk soon</p>
    `),
  }),
  // Email 8: Day 17
  (firstName) => ({
    subject: `${firstName}, clarity is one decision away`,
    html: wrapInEmailLayout(`
      <p>Hey ${firstName},</p>
      <p>For two weeks, you've been learning about your Overwhelmed Analyst tendencies and how simplification—not more analysis—is the path forward.</p>
      <p>Here's the irony: right now, you might be overthinking whether to try automation. Analyzing the pros and cons. Looking for one more piece of information.</p>
      <p>That's your pattern. Recognize it.</p>
      <p>Sometimes the best analysis is knowing when to stop analyzing and start acting.</p>
      <p><strong>For quiz takers like you:</strong></p>
      <ul>
        <li>Priority onboarding</li>
        <li>1-on-1 setup assistance</li>
        <li>Access to our Overwhelmed Analysts support group</li>
        <li>First month performance tracking</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_COMMUNITY_LINK || '#'}" class="cta">Book Your Onboarding Call</a></p>
      <p>Stop analyzing. Start executing.</p>
      <p>Talk soon</p>
    `),
  }),
];

// ============================================================
// EMAIL TEMPLATE REGISTRY
// ============================================================

const EMAIL_TEMPLATES: Record<PersonalityType, EmailTemplateFn[]> = {
  emotional_trader: emotionalTraderEmails,
  time_starved_trader: timeStarvedTraderEmails,
  inconsistent_executor: inconsistentExecutorEmails,
  overwhelmed_analyst: overwhelmedAnalystEmails,
};

export function getEmailTemplate(
  type: PersonalityType,
  emailNumber: number
): EmailTemplateFn | null {
  const templates = EMAIL_TEMPLATES[type];
  if (!templates || emailNumber < 1 || emailNumber > templates.length) return null;
  return templates[emailNumber - 1];
}

export function getAllEmailTemplates(): Record<PersonalityType, EmailTemplateFn[]> {
  return EMAIL_TEMPLATES;
}
