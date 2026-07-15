export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveRequest = {
  id: string;
  from: string;
  to: string;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
};

const KEY = 'aischool_portal_leaves';

function seed(): LeaveRequest[] {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 12);
  const to = new Date(now);
  to.setDate(to.getDate() - 10);
  return [
    {
      id: 'lv_1',
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
      reason: 'Family function',
      status: 'approved',
      appliedAt: new Date(now.getTime() - 15 * 86400000).toISOString(),
    },
  ];
}

export function loadLeaves(): LeaveRequest[] {
  if (typeof window === 'undefined') return seed();
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const s = seed();
    localStorage.setItem(KEY, JSON.stringify(s));
    return s;
  }
  try {
    return JSON.parse(raw) as LeaveRequest[];
  } catch {
    return seed();
  }
}

export function saveLeaves(leaves: LeaveRequest[]): void {
  localStorage.setItem(KEY, JSON.stringify(leaves));
}

export function addLeave(input: Omit<LeaveRequest, 'id' | 'status' | 'appliedAt'>): LeaveRequest[] {
  const entry: LeaveRequest = {
    ...input,
    id: `lv_${Date.now()}`,
    status: 'pending',
    appliedAt: new Date().toISOString(),
  };
  const next = [entry, ...loadLeaves()];
  saveLeaves(next);
  return next;
}
