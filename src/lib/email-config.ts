/**
 * Email configuration for Brevo campaigns
 * Update these values with your verified sender email
 */

export const EMAIL_CONFIG = {
  sender: {
    name: 'Quiz for Traders',
    email: process.env.SENDER_EMAIL || 'noreply@quizfortraders.com'
  },

  // Reply-to email (optional)
  replyTo: {
    email: process.env.REPLY_TO_EMAIL || 'support@quizfortraders.com',
    name: 'Quiz for Traders Support'
  }
};
