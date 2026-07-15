'use client';

import { useMemo, useState } from 'react';
import {
  inviteTeamMember,
  removeTeamMember,
  setTeamMemberStatus,
  updateTeamMemberRole,
} from '@/lib/school-store';
import { getInviteableRoles, canAddUsers, canModifyExistingUsers, canChangeUserRole, getEditableUserRoles } from '@/lib/role-access';
import type { InviteRole, TeamMember, TeamMemberStatus } from '@/lib/types';
import { useSchool } from '@/hooks/use-school';
import { useNotify } from '@/components/notifications/notification-provider';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/ui/select-field';
import { cn } from '@/lib/utils';
import {
  UserPlus,
  Shield,
  UserCheck,
  UserX,
  Trash2,
  Bus,
  GraduationCap,
  Users,
} from 'lucide-react';

type StatusFilter = 'all' | TeamMemberStatus;

const ROLE_ICONS: Partial<Record<string, typeof Users>> = {
  driver: Bus,
  teacher: GraduationCap,
  sub_admin: Shield,
};

function roleLabel(role: string) {
  if (role === 'driver') return 'Bus driver';
  return role.replace(/_/g, ' ');
}

const STATUS_STYLE: Record<TeamMemberStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-slate-200 text-slate-700',
  pending: 'bg-amber-100 text-amber-800',
};

export default function UsersPage() {
  const { state, update } = useSchool();
  const notify = useNotify();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<InviteRole>('teacher');

  const team = state?.team ?? [];

  const members = useMemo(() => {
    const q = search.trim().toLowerCase();
    return team.filter((m) => {
      if (filter !== 'all' && m.status !== filter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.role.includes(q) ||
        m.email.toLowerCase().includes(q)
      );
    });
  }, [team, filter, search]);

  const counts = useMemo(
    () => ({
      all: team.length,
      active: team.filter((m) => m.status === 'active').length,
      inactive: team.filter((m) => m.status === 'inactive').length,
      pending: team.filter((m) => m.status === 'pending').length,
    }),
    [team]
  );

  if (!state) return null;
  const schoolState = state;

  const actorRole = state.currentUser.role;
  const canAdd = canAddUsers(actorRole);
  const canModify = canModifyExistingUsers(actorRole);
  const canEditRole = canChangeUserRole(actorRole);
  const inviteRoles = getInviteableRoles(actorRole);
  const editableRoles = getEditableUserRoles(actorRole);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!canAdd) return;
    if (!name.trim() || !phone.trim()) {
      notify.error('Missing details', 'Name and mobile number are required.', 'Fill in both fields.');
      return;
    }
    const duplicate = team.some((m) => m.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));
    if (duplicate) {
      notify.error('Phone already used', 'This mobile number is already registered.', 'Use a different number or edit the existing user.');
      return;
    }
    update(inviteTeamMember(schoolState, { name, phone, email, role }));
    notify.success(
      'User added',
      `${name.trim()} was added as ${roleLabel(role)}.`,
      'They can sign in with OTP once you activate their account.'
    );
    setName('');
    setPhone('');
    setEmail('');
    setRole('teacher');
    setShowForm(false);
  }

  function handleStatus(member: TeamMember, status: TeamMemberStatus) {
    update(setTeamMemberStatus(schoolState, member.id, status));
    notify.success(
      status === 'active' ? 'User activated' : status === 'inactive' ? 'User deactivated' : 'Status updated',
      `${member.name} is now ${status}.`,
      status === 'inactive' ? 'They cannot sign in until reactivated.' : 'They can sign in with their mobile number.'
    );
  }

  function handleRoleChange(member: TeamMember, newRole: string) {
    const roleValue = newRole as InviteRole;
    if (member.role === roleValue) return;
    update(updateTeamMemberRole(schoolState, member.id, roleValue));
    notify.success(
      'Role updated',
      `${member.name} is now ${roleLabel(roleValue)}.`,
      'Permissions update immediately on their next sign-in.'
    );
  }

  function handleRemove(member: TeamMember) {
    if (!confirm(`Remove ${member.name} from the school? This cannot be undone.`)) return;
    update(removeTeamMember(schoolState, member.id));
    notify.success('User removed', `${member.name} was removed from user management.`, 'You can add them again anytime.');
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="User management"
        description={
          canModify
            ? 'Add users, change roles anytime, activate, deactivate, or remove accounts.'
            : 'Add teachers, parents, students, and bus drivers. Only the principal can deactivate, remove users, or change roles.'
        }
      >
        {canAdd ? (
          <Button onClick={() => setShowForm((v) => !v)} className="gap-2">
            <UserPlus className="h-4 w-4" aria-hidden />
            {showForm ? 'Cancel' : 'Add user'}
          </Button>
        ) : null}
      </PageHeader>

      {!canAdd ? (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6 text-sm text-amber-900">
            Your role cannot manage users. Contact the school principal.
          </CardContent>
        </Card>
      ) : null}

      {showForm && canAdd ? (
        <Card className="border-brand-200/60 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Add user</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
              <SelectField
                id="user-role"
                label="User type"
                required
                value={role}
                onChange={(v) => setRole(v as InviteRole)}
                options={inviteRoles}
                className="sm:col-span-2"
              />
              <label className="block text-sm font-medium sm:col-span-2">
                Full name *
                <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label className="block text-sm font-medium">
                Mobile (OTP login) *
                <Input className="mt-1" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </label>
              <label className="block text-sm font-medium">
                Email (optional)
                <Input type="email" className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <div className="sm:col-span-2">
                <Button type="submit">Add user</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(
          [
            { key: 'all' as const, label: 'All users', value: counts.all },
            { key: 'active' as const, label: 'Active', value: counts.active },
            { key: 'pending' as const, label: 'Pending', value: counts.pending },
            { key: 'inactive' as const, label: 'Inactive', value: counts.inactive },
          ] as const
        ).map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setFilter(s.key)}
            className={cn(
              'rounded-xl border p-3 text-left transition',
              filter === s.key ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-200' : 'border-slate-200 bg-white hover:bg-slate-50'
            )}
          >
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="text-xl font-bold text-slate-900">{s.value}</p>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Users ({members.length})</CardTitle>
          <Input
            placeholder="Search name, phone, role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
        </CardHeader>
        <CardContent className="space-y-3">
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No users match this filter.</p>
          ) : (
            members.map((m) => {
              const Icon = ROLE_ICONS[m.role] ?? Users;
              return (
                <div
                  key={m.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50/50"
                >
                  <div className="flex gap-3 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-ink-900">{m.name?.trim() || "Unnamed user"}</p>
                        <span className={cn('text-xs font-medium rounded-full px-2 py-0.5 capitalize', STATUS_STYLE[m.status])}>
                          {m.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{m.phone}</p>
                      {canEditRole ? (
                        <div className="mt-2 max-w-xs">
                          <SelectField
                            id={`role-${m.id}`}
                            label="Role"
                            value={m.role}
                            onChange={(v) => handleRoleChange(m, v)}
                            options={editableRoles.map((r) => ({
                              value: r.value,
                              label: r.label,
                            }))}
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600 capitalize">{roleLabel(m.role)}</p>
                      )}
                      {m.email ? <p className="text-xs text-slate-500">{m.email}</p> : null}
                      <p className="text-xs text-slate-400 mt-0.5">Added by {m.invitedBy}</p>
                    </div>
                  </div>
                  {canModify ? (
                    <div className="flex flex-wrap gap-2">
                      {m.status !== 'active' ? (
                        <Button type="button" size="sm" variant="secondary" onClick={() => handleStatus(m, 'active')}>
                          <UserCheck className="h-3.5 w-3.5 mr-1" />
                          Activate
                        </Button>
                      ) : (
                        <Button type="button" size="sm" variant="secondary" onClick={() => handleStatus(m, 'inactive')}>
                          <UserX className="h-3.5 w-3.5 mr-1" />
                          Deactivate
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemove(m)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {canAdd && !canModify ? (
        <p className="text-xs text-slate-500">
          As Sub Admin you can add teachers, parents, students, and bus drivers only. Deactivating, removing users, and
          changing roles are reserved for the school principal.
        </p>
      ) : null}
    </div>
  );
}
