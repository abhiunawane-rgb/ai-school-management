import type { Role } from '../types/index.js';
import type { SchoolAiSnapshot } from './school-snapshot.js';

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

function includesAny(text: string, terms: string[]): boolean {
  return terms.some((t) => text.includes(t));
}

/** Whole-word match — avoids "hi" matching inside "child" / "this". */
function includesAnyWord(text: string, terms: string[]): boolean {
  return terms.some((t) => {
    const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, 'i').test(text);
  });
}

type Intent =
  | 'greeting'
  | 'homework'
  | 'syllabus'
  | 'notices'
  | 'events'
  | 'feed'
  | 'fees'
  | 'bus'
  | 'attendance'
  | 'timetable'
  | 'team'
  | 'subscription'
  | 'leave'
  | 'unknown';

/**
 * Score-based intent detection. Bus is checked before attendance so
 * "bus late" / "transport status" never returns the attendance register.
 */
function detectIntent(q: string): Intent {
  if (!q) return 'unknown';
  if (includesAnyWord(q, ['hello', 'hi', 'hey', 'help'])) return 'greeting';

  const scores: Partial<Record<Intent, number>> = {};
  const bump = (intent: Intent, n: number) => {
    scores[intent] = (scores[intent] ?? 0) + n;
  };

  // Strong domain keywords
  if (includesAny(q, ['bus', 'transport', 'gps', 'vehicle', 'fleet'])) bump('bus', 10);
  if (includesAnyWord(q, ['route']) && includesAny(q, ['bus', 'transport', 'driver', 'pickup', 'drop'])) {
    bump('bus', 8);
  }
  if (includesAny(q, ['bus']) && includesAnyWord(q, ['late', 'delay', 'status', 'location', 'live', 'where'])) {
    bump('bus', 12);
  }

  if (includesAny(q, ['attendance', 'register', 'present', 'absent'])) bump('attendance', 10);
  if (includesAnyWord(q, ['late']) && includesAny(q, ['student', 'class', 'marked', 'came', 'arrival', 'attendance'])) {
    bump('attendance', 8);
  }
  // Bare "late" without bus/fee context → weak attendance only if school words present
  if (includesAnyWord(q, ['late']) && !includesAny(q, ['bus', 'transport', 'fee', 'fees', 'payment'])) {
    bump('attendance', 2);
  }

  if (includesAny(q, ['homework', 'assignment', 'worksheet'])) bump('homework', 10);
  if (
    includesAnyWord(q, ['due']) &&
    includesAny(q, ['homework', 'assignment', 'work', 'task', 'soon', 'week'])
  ) {
    bump('homework', 8);
  }

  if (includesAny(q, ['syllabus', 'curriculum', 'chapter', 'lesson plan', 'lessons'])) bump('syllabus', 10);
  if (includesAnyWord(q, ['unit']) && includesAny(q, ['syllabus', 'chapter', 'subject', 'class'])) {
    bump('syllabus', 6);
  }

  if (includesAny(q, ['notice', 'notices', 'announcement', 'circular', 'bulletin'])) bump('notices', 10);
  if (includesAny(q, ['event', 'events', 'sports day', 'exhibition', 'cultural', 'happening'])) {
    bump('events', 10);
  }
  if (includesAny(q, ['feed', 'community', 'social']) || includesAnyWord(q, ['post', 'posts', 'share'])) {
    bump('feed', 8);
  }

  if (includesAny(q, ['fee', 'fees', 'payment', 'outstanding', 'owe', 'balance', 'collect', 'invoice'])) {
    bump('fees', 10);
  }
  if (
    includesAnyWord(q, ['due', 'pending', 'overdue', 'defaulter']) &&
    includesAny(q, ['fee', 'fees', 'payment', 'money', 'amount', 'month', 'student'])
  ) {
    bump('fees', 8);
  }

  if (includesAny(q, ['timetable', 'schedule', 'period', 'periods'])) bump('timetable', 10);
  if (includesAny(q, ['class today']) || (includesAnyWord(q, ['today']) && includesAny(q, ['class', 'period']))) {
    bump('timetable', 6);
  }

  if (includesAny(q, ['team', 'staff', 'invite', 'member'])) bump('team', 8);
  if (includesAnyWord(q, ['teacher', 'teachers']) && includesAny(q, ['count', 'how many', 'team', 'staff'])) {
    bump('team', 6);
  }

  if (includesAny(q, ['plan', 'subscription', 'trial', 'billing'])) bump('subscription', 10);
  if (includesAnyWord(q, ['leave', 'holiday', 'holidays'])) bump('leave', 8);

  let best: Intent = 'unknown';
  let bestScore = 0;
  for (const [intent, score] of Object.entries(scores) as [Intent, number][]) {
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return bestScore >= 6 ? best : bestScore > 0 ? best : 'unknown';
}

export function getAiSuggestionPrompts(snapshot: SchoolAiSnapshot): string[] {
  const { role } = snapshot;
  const admin: string[] = [
    'What is total outstanding fees this month?',
    "Today's attendance summary",
    'Upcoming school events',
    'Latest notices',
    'How many homework assignments are due soon?',
    'Active bus routes right now',
  ];
  const teacher: string[] = [
    "Today's class timetable",
    'Students absent in my class today',
    'Upcoming homework due dates',
    'Show syllabus for class 8-A',
    'Latest school notices',
    'How do I publish a community post?',
  ];
  const parent: string[] = [
    "What is my child's fee balance?",
    'Is my child present today?',
    'Homework due this week',
    'Upcoming school events',
    'Bus route live status',
    'Latest notices for parents',
  ];
  const student: string[] = [
    'Homework due this week',
    "Today's class schedule",
    'What is on my syllabus this week?',
    'Upcoming school events',
    'Latest notices',
  ];
  const driver: string[] = [
    'My bus route details',
    'How do I update GPS location?',
    'Upcoming school events',
    'Apply for duty leave',
    'Emergency contact for transport',
  ];

  const byRole: Record<Role, string[]> = {
    super_admin: admin,
    school_admin: admin,
    sub_admin: admin,
    teacher,
    parent,
    student,
    driver,
  };

  return byRole[role] ?? admin;
}

export function answerFromSchoolSnapshot(question: string, snapshot: SchoolAiSnapshot): string {
  const q = question.toLowerCase().trim();
  const { schoolName, currency, today, role } = snapshot;
  const intent = detectIntent(q);

  if (intent === 'unknown' && !q) {
    return `Ask me anything about ${schoolName} — fees, attendance, homework, syllabus, notices, events, buses, or team.`;
  }

  if (intent === 'greeting') {
    return `Hello${snapshot.viewerName ? `, ${snapshot.viewerName}` : ''}! I'm your AI assistant for **${schoolName}**. I answer using your school data — try a suggestion below, or ask about fees, attendance, homework, syllabus, notices, events, buses, or timetable.`;
  }

  if (intent === 'homework') {
    if (!snapshot.homework) {
      return `No homework data is loaded yet for ${schoolName}. Teachers can publish assignments under **Homework**.`;
    }
    const h = snapshot.homework;
    if (h.upcoming.length === 0) {
      return `No homework assignments are scheduled right now for ${schoolName}.`;
    }
    const list = h.upcoming
      .map((item) => `• **${item.title}** — ${item.classSection}, ${item.subject}, due ${item.dueDate}`)
      .join('\n');
    return `**${h.count} assignment(s)** on file. Upcoming:\n${list}`;
  }

  if (intent === 'syllabus') {
    if (!snapshot.syllabus || snapshot.syllabus.units.length === 0) {
      return `No syllabus units are published yet. Teachers can add them under **Syllabus**.`;
    }
    const s = snapshot.syllabus;
    const list = s.units
      .map(
        (u) =>
          `• **${u.title}** — ${u.subject} · ${u.classSection} · ${u.weekLabel} (${u.teacher})`
      )
      .join('\n');
    return `**Syllabus (${s.count} unit(s))**\n${list}\n\nOpen **Syllabus** to add or update chapters.`;
  }

  if (intent === 'notices') {
    if (!snapshot.notices || snapshot.notices.latest.length === 0) {
      return `There are no notices posted yet for ${schoolName}.`;
    }
    const n = snapshot.notices;
    const list = n.latest
      .map((item) => `• **${item.title}** — ${item.audience} · ${item.date}`)
      .join('\n');
    return `**${n.count} notice(s)** on the board. Latest:\n${list}\n\nManage under **Notices**.`;
  }

  if (intent === 'events') {
    if (!snapshot.events || snapshot.events.upcoming.length === 0) {
      return `No upcoming school events are published yet.`;
    }
    const e = snapshot.events;
    const list = e.upcoming
      .map((item) => `• **${item.title}** — ${item.date} @ ${item.location} (${item.category})`)
      .join('\n');
    return `**Upcoming events (${e.count})**\n${list}\n\nFull calendar is under **Community feed** / Events.`;
  }

  if (intent === 'feed') {
    if (!snapshot.feed) {
      return `The community feed is empty. Teachers and admins can publish updates under **Community feed**.`;
    }
    const f = snapshot.feed;
    const list = f.latest
      .map((item) => `• **${item.title}** — ${item.author} (${item.type})`)
      .join('\n');
    return `**Community feed (${f.count} post(s))**\n${list || 'No posts yet.'}\n\nTeachers and admins can publish updates under **Community feed**.`;
  }

  if (intent === 'fees') {
    if (!snapshot.fees) {
      return `Fee data is not available yet. Open **Fees** to set up student fee accounts.`;
    }
    const f = snapshot.fees;
    if (includesAny(q, ['month', 'this month', 'current month'])) {
      return [
        `**Fee outstanding — ${monthKey(today)}**`,
        `• Due this month: **${formatMoney(f.dueThisMonth, currency)}**`,
        `• Total pending (all terms): **${formatMoney(f.totalPending, currency)}**`,
        `• Collected so far: **${formatMoney(f.totalPaid, currency)}** of **${formatMoney(f.totalFees, currency)}**`,
        `• Students: ${f.paidCount} fully paid · ${f.partialCount} partial · ${f.pendingCount} with balance · ${f.overdueCount} overdue`,
        f.topPending?.length
          ? `• Highest pending: ${f.topPending.map((s) => `${s.studentName} (${s.classSection}) — ${formatMoney(s.pending, currency)}`).join('; ')}`
          : '',
      ]
        .filter(Boolean)
        .join('\n');
    }
    if (includesAny(q, ['overdue', 'defaulter']) || (includesAnyWord(q, ['late']) && includesAny(q, ['fee', 'fees', 'payment']))) {
      if (f.overdueCount === 0) {
        return `No students are overdue on fees right now. Total pending across the school is **${formatMoney(f.totalPending, currency)}**.`;
      }
      const list =
        f.topPending
          ?.filter((s) => s.pending > 0)
          .map((s) => `• ${s.studentName} (${s.classSection}) — ${formatMoney(s.pending, currency)}`)
          .join('\n') ?? '';
      return `**${f.overdueCount} student(s)** have overdue fee balances.\n${list}\n\nTotal school-wide pending: **${formatMoney(f.totalPending, currency)}**. Record payments under **Fees**.`;
    }
    if (role === 'parent' && includesAny(q, ['my', 'child', 'our'])) {
      const child = f.topPending?.[0];
      if (child) {
        return `**${child.studentName}** (${child.classSection}) has a pending fee balance of **${formatMoney(child.pending, currency)}**. Pay online or at the school office. View details under **Fees**.`;
      }
    }
    return [
      `**Fee summary — ${schoolName}**`,
      `• Total assigned: **${formatMoney(f.totalFees, currency)}**`,
      `• Collected: **${formatMoney(f.totalPaid, currency)}**`,
      `• Outstanding: **${formatMoney(f.totalPending, currency)}**`,
      `• Due this month: **${formatMoney(f.dueThisMonth, currency)}**`,
      `• ${f.paidCount}/${f.studentCount} students fully paid`,
    ].join('\n');
  }

  // Bus BEFORE attendance handling — critical for "bus late / bus status"
  if (intent === 'bus') {
    if (!snapshot.busRoutes || snapshot.busRoutes.count === 0) {
      return `No bus routes are configured yet for ${schoolName}. Add routes under **Bus tracking**.`;
    }
    const b = snapshot.busRoutes;
    const list = b.routes
      .map((r) => `• **${r.name}** — ${r.driver}, ${r.vehicleNo} (${r.status})`)
      .join('\n');
    return `**Bus fleet (${b.count} routes)** — ${b.active} active now:\n${list}\n\nDrivers update GPS from **My route**; parents see live location under **Bus tracking**.`;
  }

  if (intent === 'attendance') {
    if (!snapshot.attendance) {
      return `No attendance has been marked for today yet. Teachers can mark the register under **Attendance**.`;
    }
    const a = snapshot.attendance;
    if (includesAny(q, ['absent', 'missing', 'not present'])) {
      const names = a.absentStudents?.length
        ? a.absentStudents.join(', ')
        : 'No absences recorded';
      return `**Attendance — ${a.date}**\n• Absent (${a.absent}): ${names}\n• Present: ${a.present} · Late: ${a.late} · Total marked: ${a.total}`;
    }
    if (role === 'parent' && includesAny(q, ['child', 'my kid', 'my son', 'my daughter'])) {
      return `Today's register (${a.date}): **${a.present} present**, **${a.absent} absent**, **${a.late} late** (total marked: ${a.total}). Open **Attendance** to see your child's status.`;
    }
    return `**Today's attendance (${a.date})**\n• Present: **${a.present}**\n• Absent: **${a.absent}**\n• Late: **${a.late}**\n• Total students marked: **${a.total}**${a.byClass ? `\n• By class: ${Object.entries(a.byClass).map(([c, v]) => `${c} (${v.present}P/${v.absent}A/${v.late}L)`).join(' · ')}` : ''}`;
  }

  if (intent === 'timetable') {
    if (!snapshot.timetable) {
      return `No timetable is set up yet. Add periods under **Timetable**.`;
    }
    const t = snapshot.timetable;
    if (t.todaySlots.length === 0) {
      return `No timetable slots for **${t.todayDay}** in the current schedule. Add periods under **Timetable**.`;
    }
    const list = t.todaySlots
      .map((s) => `• ${s.time} — **${s.subject}** (${s.classSection}) with ${s.teacher}, ${s.room}`)
      .join('\n');
    return `**${t.todayDay}'s schedule** (${t.count} slots total):\n${list}`;
  }

  if (intent === 'team' && snapshot.team) {
    const t = snapshot.team;
    return `**Team — ${schoolName}**\n• Total members: **${t.total}**\n• Teachers: ${t.teachers} · Parents: ${t.parents} · Students: ${t.students} · Drivers: ${t.drivers}\n\nInvite new members under **User management**.`;
  }

  if (intent === 'subscription' && snapshot.subscription) {
    const s = snapshot.subscription;
    return `**Subscription**\n• Plan: **${s.planName}** (${s.status})\n• Students: ${s.studentCount} · Staff: ${s.teacherCount}${s.trialEndsAt ? `\n• Trial ends: ${s.trialEndsAt.slice(0, 10)}` : ''}\n\nManage billing under **Subscription**.`;
  }

  if (intent === 'leave') {
    return 'Apply for leave under **Leave requests**. Approved school holidays appear in the **Holiday calendar**.';
  }

  return `I can help with **fees**, **attendance**, **homework**, **syllabus**, **notices**, **events**, **community feed**, **bus routes**, **timetable**, and **team** for ${schoolName}. Try a suggestion below or ask something specific — e.g. "Bus route live status" or "Is my child present today?".`;
}
