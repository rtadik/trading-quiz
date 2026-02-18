# Email Campaign Manager - Admin Guide

## Overview

The Email Campaign Manager is a custom admin tool that lets you draft, preview, and send targeted email campaigns directly from your admin dashboard.

**Key Features:**
- ✍️ Draft emails directly in the UI (or use saved templates)
- 🎯 Target specific user segments (personality types, custom filters)
- 👁️ Preview emails before sending
- 📊 Track campaign performance
- 🔄 Reuse successful templates

---

## Getting Started

### 1. Access the Admin Panel

Navigate to: **`/admin/emails`**

Or click "📧 Email Campaign Manager" from the main admin dashboard.

---

## How to Send a Campaign

### Step 1: Choose Template (Optional)

- Select from existing templates to prefill subject and body
- Or start from scratch

### Step 2: Compose Email

**Subject Line:**
- Write a compelling subject line
- Use variables for personalization: `{{firstName}}`, `{{personalityType}}`, `{{email}}`

**Email Body:**
- Write in plain text or HTML
- Use variables for dynamic content:
  - `{{firstName}}` → Recipient's first name
  - `{{personalityType}}` → Their trading personality type
  - `{{email}}` → Their email address

**Example:**
```html
<p>Hey {{firstName}},</p>

<p>As an <strong>{{personalityType}}</strong>, you have unique strengths that can help you succeed in trading.</p>

<p>Here are 3 strategies tailored specifically for your type...</p>
```

**Save as Template:**
- Click "Save as Template" to reuse this email later
- Templates are stored in the database

### Step 3: Select Recipients

**Segment Types:**

1. **All Users** - Send to everyone in your database
2. **By Personality Type** - Filter by specific personality types:
   - ANALYTICAL_TRADER
   - AGGRESSIVE_TRADER
   - CONSERVATIVE_TRADER
   - ADAPTIVE_TRADER

**Recipient Count:**
- The system automatically shows how many people will receive the email
- Double-check this number before sending!

### Step 4: Preview & Send

1. **Preview Email** - Click to see how the email will look with variables replaced
2. **Send Email** - Click to send immediately
   - You'll be asked to confirm before sending
   - Emails are sent via Brevo API
   - Campaign is logged in the database

---

## Advanced Features

### Variable Personalization

Available variables:
- `{{firstName}}` - Contact's first name
- `{{personalityType}}` - Their personality type (e.g., "ANALYTICAL_TRADER")
- `{{email}}` - Their email address

### HTML Support

You can use full HTML in the email body:

```html
<div style="background: #f4f4f4; padding: 20px;">
  <h1>Welcome, {{firstName}}!</h1>
  <p>Your personality type: <strong>{{personalityType}}</strong></p>
  <a href="https://quizfortraders.com" style="background: blue; color: white; padding: 10px;">
    Learn More
  </a>
</div>
```

### Template Management

**Creating Templates:**
1. Draft your email
2. Click "Save as Template"
3. It will appear in the template dropdown

**Using Templates:**
1. Select from dropdown
2. Subject and body are pre-filled
3. Customize as needed before sending

---

## Configuration

### Environment Variables

Add to your `.env` file:

```bash
# Required
BREVO_API_KEY=your-brevo-api-key-here

# Optional (customize sender)
SENDER_EMAIL=noreply@quizfortraders.com
REPLY_TO_EMAIL=support@quizfortraders.com
```

### Sender Configuration

Edit [`/src/lib/email-config.ts`](src/lib/email-config.ts) to customize:

```typescript
export const EMAIL_CONFIG = {
  sender: {
    name: 'Quiz for Traders',
    email: process.env.SENDER_EMAIL || 'noreply@quizfortraders.com'
  },
  replyTo: {
    email: process.env.REPLY_TO_EMAIL || 'support@quizfortraders.com',
    name: 'Quiz for Traders Support'
  }
};
```

**Important:** Make sure your sender email is verified in Brevo!

---

## Database Schema

The system uses these models:

### EmailTemplate
- Stores reusable email templates
- Fields: name, subject, body, category, status

### EmailCampaign
- Logs every campaign sent
- Tracks: recipients, sent count, open/click rates, status

---

## API Routes

The admin page uses these endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/email-templates` | GET | Fetch all templates |
| `/api/admin/email-templates` | POST | Save template |
| `/api/admin/recipients/count` | GET | Get recipient count for segment |
| `/api/admin/send-campaign` | POST | Send campaign via Brevo |

---

## Troubleshooting

### "Brevo API key not configured"
- Make sure `BREVO_API_KEY` is set in `.env`
- Restart your dev server after adding it

### "No recipients found"
- Check your segment filters
- Make sure users exist in the database
- Try selecting "All Users" to test

### "Failed to send email"
- Verify your sender email is verified in Brevo
- Check Brevo API key is valid
- Check Brevo API logs for detailed errors

### Emails not sending
- Check the EmailCampaign table for error logs
- Verify recipient email addresses are valid
- Check Brevo dashboard for delivery status

---

## Best Practices

### Before Sending

1. **Test First** - Send to yourself or a test email
2. **Check Variables** - Make sure `{{variables}}` are spelled correctly
3. **Preview** - Always preview before sending
4. **Verify Count** - Double-check recipient count

### Email Content

1. **Personalize** - Use first names and personality types
2. **Clear CTA** - Include a clear call-to-action
3. **Mobile-Friendly** - Keep emails simple and readable on mobile
4. **Unsubscribe** - Include unsubscribe link (Brevo adds this automatically)

### Segmentation

1. **Start Small** - Test with small segments first
2. **Personality-Specific** - Tailor content to each personality type
3. **Timing** - Consider when your audience is most engaged

---

## Future Enhancements

Potential features to add:

- [ ] Schedule campaigns for later
- [ ] A/B testing (subject lines, content)
- [ ] Campaign analytics dashboard
- [ ] Email performance tracking (opens, clicks)
- [ ] Drag-and-drop email builder
- [ ] Automated drip campaigns
- [ ] Webhook integration for Brevo events

---

## Support

Questions or issues? Check:
- Brevo API documentation
- This project's CLAUDE.md for context
- EmailCampaign logs in database

---

**Built with:**
- Next.js App Router
- Prisma (PostgreSQL)
- Brevo API
- Framer Motion (UI animations)
