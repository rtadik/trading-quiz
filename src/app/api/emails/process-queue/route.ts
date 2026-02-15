import { NextRequest, NextResponse } from 'next/server';
import { processEmailQueue } from '@/lib/email-scheduler';

export const dynamic = 'force-dynamic';

async function handleRequest(request: NextRequest) {
  try {
    // Authentication check - supports multiple methods for different triggers
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Check for secret in query params (for UptimeRobot and external monitors)
    const { searchParams } = new URL(request.url);
    const secretParam = searchParams.get('secret');

    // Allow if:
    // 1. No CRON_SECRET is set (development)
    // 2. Authorization header matches Bearer token (manual triggers)
    // 3. Query parameter matches secret (UptimeRobot, external monitors)
    // 4. Request is from Vercel production (automatic cron)
    const isProduction = process.env.VERCEL === '1';
    const hasValidAuth =
      !cronSecret ||
      authHeader === `Bearer ${cronSecret}` ||
      secretParam === cronSecret;

    if (!isProduction && cronSecret && !hasValidAuth) {
      console.error('Unauthorized cron attempt - invalid or missing secret');
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
