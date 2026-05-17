import { NextResponse } from 'next/server';
import { z } from 'zod';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { TRIAL_DAYS } from '@/lib/pricing-data';

const signupSchema = z.object({
  schoolName: z.string().min(2).max(120),
  schoolAddress: z.string().optional(),
  city: z.string().optional(),
  board: z.string().optional(),
  schoolWebsite: z.string().optional(),
  logoBase64: z.string().optional().nullable(),
  currency: z.string().min(3).max(3),
  countryCode: z.string().length(2),
  students: z.number().int().min(1).max(100000),
  teachers: z.number().int().min(1).max(5000),
  planId: z.enum(['starter', 'growth', 'enterprise']),
  interval: z.enum(['monthly', 'yearly']),
  addons: z.array(z.string()).default([]),
  adminName: z.string().min(2),
  principalName: z.string().optional(),
  phone: z.string().min(10),
  email: z.string().email(),
  estimatedTotal: z.number(),
  trialDays: z.number().default(TRIAL_DAYS),
  acceptedTerms: z.literal(true),
  acceptedAutoRenew: z.literal(true),
});

const LEADS_DIR = join(process.cwd(), '.data', 'leads');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = signupSchema.parse(body);

    const tenantSlug = data.schoolName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);

    const lead = {
      id: `lead_${Date.now()}`,
      ...data,
      tenantSlug,
      status: 'trial_active',
      trialEndsAt: trialEndsAt.toISOString(),
      subscriptionStartsAt: trialEndsAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    await mkdir(LEADS_DIR, { recursive: true });
    const filePath = join(LEADS_DIR, `${lead.id}.json`);
    const { logoBase64, ...leadWithoutLogo } = lead;
    await writeFile(filePath, JSON.stringify(leadWithoutLogo, null, 2), 'utf-8');

    if (logoBase64 && logoBase64.length < 500_000) {
      await writeFile(join(LEADS_DIR, `${lead.id}_logo.txt`), logoBase64, 'utf-8');
    }

    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001';
    const checkoutUrl = `${adminUrl}/login?tenant=${tenantSlug}&trial=1&phone=${encodeURIComponent(data.phone)}`;

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      tenantSlug,
      trialDays: TRIAL_DAYS,
      message: `${TRIAL_DAYS}-day trial started. Subscription auto-starts after trial unless canceled.`,
      checkoutUrl,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please complete all required fields', details: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
