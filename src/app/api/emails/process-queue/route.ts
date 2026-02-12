import { NextRequest, NextResponse } from 'next/server';
import { processEmailQueue } from '@/lib/email-scheduler';

export const dynamic = 'force-dynamic';

async function handleRequest(request: NextRequest) {
  try {
    // Simple authentication check - in production, Vercel Crons are automatically authenticated
    // For manual triggers, optionally check a Bearer token
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Allow if:
    // 1. No CRON_SECRET is set (development)
    // 2. Authorization header matches Bearer token
    // 3. Request is from Vercel (they handle auth automatically)
    const isProduction = process.env.VERCEL === '1';
    const hasValidAuth = !cronSecret || authHeader === `Bearer ${cronSecret}`;

    if (!isProduction && cronSecret && !hasValidAuth) {
      console.error('Unauthorized cron attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Processing email queue...');
    const result = await processEmailQueue();
    console.log(`Email queue processed: ${result.processed} sent, ${result.errors} errors`);

    return NextResponse.json({
      success: true,
      processed: result.processed,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Email queue processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}
