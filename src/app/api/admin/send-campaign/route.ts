import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { EMAIL_CONFIG } from '@/lib/email-config';

const BREVO_API_KEY = process.env.BREVO_API_KEY;

interface SegmentFilter {
  personalityTypes?: string[];
}

export async function POST(request: Request) {
  try {
    const { subject, body, segmentType, segmentFilter } = await request.json();

    if (!subject || !body) {
      return NextResponse.json(
        { error: 'Subject and body are required' },
        { status: 400 }
      );
    }

    if (!BREVO_API_KEY) {
      return NextResponse.json(
        { error: 'Brevo API key not configured' },
        { status: 500 }
      );
    }

    // Build query to get recipients
    let whereClause: any = {};

    if (segmentType === 'personality_type' && segmentFilter?.personalityTypes) {
      whereClause.personalityType = {
        in: segmentFilter.personalityTypes
      };
    }

    // Get recipients
    const recipients = await prisma.contact.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        personalityType: true
      }
    });

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found' },
        { status: 400 }
      );
    }

    // Create campaign record
    const campaign = await prisma.emailCampaign.create({
      data: {
        name: `Campaign: ${subject}`,
        subject,
        body,
        segmentType,
        segmentFilter: JSON.stringify(segmentFilter),
        recipientCount: recipients.length,
        status: 'sending'
      }
    });

    // Send emails via Brevo
    let sentCount = 0;
    let errors: string[] = [];

    for (const recipient of recipients) {
      try {
        // Replace variables in email body
        const personalizedBody = body
          .replace(/{{firstName}}/g, recipient.firstName)
          .replace(/{{personalityType}}/g, recipient.personalityType)
          .replace(/{{email}}/g, recipient.email);

        const personalizedSubject = subject
          .replace(/{{firstName}}/g, recipient.firstName)
          .replace(/{{personalityType}}/g, recipient.personalityType);

        // Send via Brevo
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sender: EMAIL_CONFIG.sender,
            replyTo: EMAIL_CONFIG.replyTo,
            to: [
              {
                email: recipient.email,
                name: recipient.firstName
              }
            ],
            subject: personalizedSubject,
            htmlContent: personalizedBody
          })
        });

        if (response.ok) {
          sentCount++;
        } else {
          const errorData = await response.json();
          errors.push(`${recipient.email}: ${errorData.message}`);
          console.error('Brevo send error:', errorData);
        }
      } catch (error) {
        errors.push(`${recipient.email}: ${error}`);
        console.error('Error sending to', recipient.email, error);
      }
    }

    // Update campaign status
    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: {
        status: sentCount === recipients.length ? 'sent' : 'failed',
        sentCount,
        sentAt: new Date()
      }
    });

    return NextResponse.json({
      campaignId: campaign.id,
      sentCount,
      totalRecipients: recipients.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json(
      { error: 'Failed to send campaign' },
      { status: 500 }
    );
  }
}
