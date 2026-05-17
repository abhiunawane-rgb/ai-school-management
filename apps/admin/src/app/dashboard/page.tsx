'use client';

import Link from 'next/link';
import { useSchool } from '@/hooks/use-school';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, Receipt, UserCircle } from 'lucide-react';

export default function DashboardPage() {
  const { state } = useSchool();
  if (!state) return null;

  const { school, team, invoices } = state;
  const pendingInvites = team.filter((m) => m.status === 'pending').length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-slate-600 mt-1">
          {school.name} · {school.planName} plan · {school.studentCount} students
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Team members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{team.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{pendingInvites} pending invites</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{school.subscriptionStatus}</p>
            <p className="text-xs text-muted-foreground mt-1">{school.planName} · {school.billingInterval}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{invoices.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Billing history</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Currency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{school.currency}</p>
            <p className="text-xs text-muted-foreground mt-1">Billing currency</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { href: '/dashboard/profile', icon: UserCircle, title: 'School profile', desc: 'Name, logo, and contact details' },
          { href: '/dashboard/team', icon: Users, title: 'Team & invites', desc: 'Invite parents, teachers, students, drivers' },
          { href: '/dashboard/subscription', icon: CreditCard, title: 'Subscription', desc: 'Plan, trial, and modules' },
          { href: '/dashboard/billing', icon: Receipt, title: 'Billing', desc: 'Invoices and payment history' },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <item.icon className="h-6 w-6 text-blue-600 mb-2" />
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 text-sm text-amber-900">
          <strong>Local testing mode:</strong> Data is stored in your browser. Complete signup on the marketing
          site (port 3002) to load your school profile, or use the demo school after login.
        </CardContent>
      </Card>
    </div>
  );
}
