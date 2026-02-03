import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalContacts = await prisma.contact.count();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayContacts = await prisma.contact.count({
      where: { createdAt: { gte: todayStart } },
    });

    const emailsSent = await prisma.emailSchedule.count({
      where: { status: 'sent' },
    });

    const emailsPending = await prisma.emailSchedule.count({
      where: { status: 'pending' },
    });

    const emailsFailed = await prisma.emailSchedule.count({
      where: { status: 'failed' },
    });

    // Type distribution
    const typeDistribution = await prisma.contact.groupBy({
      by: ['personalityType'],
      _count: { personalityType: true },
    });

    // Submissions over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentContacts = await prisma.contact.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const submissionsByDate: Record<string, number> = {};
    recentContacts.forEach((contact) => {
      const date = contact.createdAt.toISOString().split('T')[0];
      submissionsByDate[date] = (submissionsByDate[date] || 0) + 1;
    });

    // Experience distribution
    const experienceDistribution = await prisma.contact.groupBy({
      by: ['experienceLevel'],
      _count: { experienceLevel: true },
    });

    // Automation interest distribution
    const automationDistribution = await prisma.contact.groupBy({
      by: ['automationExperience'],
      _count: { automationExperience: true },
    });

    return NextResponse.json({
      totalContacts,
      todayContacts,
      emailsSent,
      emailsPending,
      emailsFailed,
      typeDistribution: typeDistribution.map((t) => ({
        type: t.personalityType,
        count: t._count.personalityType,
      })),
      submissionsByDate,
      experienceDistribution: experienceDistribution.map((e) => ({
        level: e.experienceLevel,
        count: e._count.experienceLevel,
      })),
      automationDistribution: automationDistribution.map((a) => ({
        experience: a.automationExperience,
        count: a._count.automationExperience,
      })),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
