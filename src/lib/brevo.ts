const BREVO_API_URL = 'https://api.brevo.com/v3';

function getApiKey(): string {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error('BREVO_API_KEY not configured');
  return key;
}

async function brevoFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BREVO_API_URL}${path}`, {
    ...options,
    headers: {
      'api-key': getApiKey(),
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Brevo API error (${res.status}): ${errorBody}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Personality type to Brevo list ID mapping
// You need to create these lists in Brevo and set the IDs here
const PERSONALITY_LIST_IDS: Record<string, number> = {
  emotional_trader: 1,
  time_starved_trader: 2,
  inconsistent_executor: 3,
  overwhelmed_analyst: 4,
};

export async function createBrevoContact(params: {
  email: string;
  firstName: string;
  personalityType: string;
  experienceLevel: string;
  performance: string;
  automationExperience: string;
}) {
  const listIds = PERSONALITY_LIST_IDS[params.personalityType];

  return brevoFetch('/contacts', {
    method: 'POST',
    body: JSON.stringify({
      email: params.email,
      attributes: {
        FIRSTNAME: params.firstName,
        PERSONALITY_TYPE: params.personalityType,
        EXPERIENCE_LEVEL: params.experienceLevel,
        PERFORMANCE: params.performance,
        AUTOMATION_EXPERIENCE: params.automationExperience,
      },
      listIds: listIds ? [listIds] : [],
      updateEnabled: true,
    }),
  });
}

export async function sendTransactionalEmail(params: {
  to: string;
  toName: string;
  subject: string;
  htmlContent: string;
  attachment?: { name: string; content: string }; // base64
}) {
  const senderEmail = process.env.SENDER_EMAIL || 'noreply@yourdomain.com';
  const senderName = process.env.SENDER_NAME || 'Trading Quiz';

  const body: Record<string, unknown> = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: params.to, name: params.toName }],
    subject: params.subject,
    htmlContent: params.htmlContent,
  };

  if (params.attachment) {
    body.attachment = [{
      name: params.attachment.name,
      content: params.attachment.content,
    }];
  }

  return brevoFetch('/smtp/email', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
