'use client';

import { useState } from 'react';
import { useSchool } from '@/hooks/use-school';
import {
  canManageTeam,
  canPromoteToSubAdmin,
  inviteTeamMember,
  promoteTeacherToSubAdmin,
} from '@/lib/school-store';
import type { InviteRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserPlus, Shield } from 'lucide-react';

const INVITE_ROLES: { value: InviteRole; label: string }[] = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'parent', label: 'Parent' },
  { value: 'student', label: 'Student' },
  { value: 'driver', label: 'Driver' },
];

export default function TeamPage() {
  const { state, update } = useSchool();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<InviteRole>('teacher');
  const [message, setMessage] = useState('');

  if (!state) return null;

  const canInvite = canManageTeam(state.currentUser.role);
  const canPromote = canPromoteToSubAdmin(state.currentUser.role);

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!state || !canInvite) return;
    update(inviteTeamMember(state, { name, phone, email, role }));
    setMessage(`Invitation sent to ${name} (${role.replace(/_/g, ' ')})`);
    setName('');
    setPhone('');
    setEmail('');
    setRole('teacher');
  }

  function handlePromote(memberId: string, memberName: string) {
    if (!state) return;
    update(promoteTeacherToSubAdmin(state, memberId));
    setMessage(`${memberName} is now a Sub Admin and can invite team members on your behalf.`);
  }

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Team & invites</h1>
        <p className="text-slate-600 text-sm mt-1">
          Invite parents, teachers, students, and drivers. Sub Admins can send invites on behalf of the principal.
        </p>
      </div>

      {!canInvite && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6 text-sm text-amber-900">
            Your role cannot send invitations. Contact your school principal for access.
          </CardContent>
        </Card>
      )}

      {canInvite && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Send invitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <label className="block text-sm font-medium">
                Role
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as InviteRole)}
                  className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                >
                  {INVITE_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Full name
                <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label className="block text-sm font-medium">
                Mobile (OTP login)
                <Input className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </label>
              <label className="block text-sm font-medium">
                Email
                <Input
                  type="email"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <Button type="submit">Send invite</Button>
            </form>
            {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Team members ({state.team.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.team.length === 0 ? (
            <p className="text-sm text-muted-foreground">No team members yet. Send your first invite above.</p>
          ) : (
            state.team.map((m) => (
              <div key={m.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {m.role.replace(/_/g, ' ')} · {m.phone} · {m.status}
                  </p>
                  <p className="text-xs text-muted-foreground">Invited by {m.invitedBy}</p>
                </div>
                {canPromote && m.role === 'teacher' && (
                  <Button type="button" variant="secondary" size="sm" onClick={() => handlePromote(m.id, m.name)}>
                    <Shield className="h-4 w-4 mr-1" />
                    Make Sub Admin
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {canPromote && (
        <p className="text-xs text-slate-500">
          Sub Admins can invite parents, teachers, students, and drivers on behalf of the principal. They cannot
          change billing or subscription settings.
        </p>
      )}
    </div>
  );
}
