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

  if (!q) {
    return `Ask me anything about ${schoolName} — fees, attendance, homework, syllabus, notices, events, buses, or team.`;
  }

  // Word-boundary only: bare "hi" must not match "child" or "this"
  if (includesAnyWord(q, ['hello', 'hi', 'hey', 'help'])) {
    return `Hello${snapshot.viewerName ? `, ${snapshot.viewerName}` : ''}! I'm your AI assistant for **${schoolName}**. I answer using your school data — try a suggestion below, or ask about fees, attendance, homework, syllabus, notices, events, buses, or timetable.`;
  }

  // Homework before fees when "due" alone would otherwise match fee balances
  const homeworkIntent =
    snapshot.homework &&
    (includesAny(q, ['homework', 'assignment', 'worksheet']) ||
      (includesAny(q, ['due']) && includesAny(q, ['homework', 'assignment', 'work', 'task', 'soon'])));

  if (homeworkIntent) {
    const h = snapshot.homework!;
    if (h.upcoming.length === 0) {
      return `No homework assignments are scheduled right now for ${schoolName}.`;
    }
    const list = h.upcoming
      .map((item) => `• **${item.title}** — ${item.classSection}, ${item.subject}, due ${item.dueDate}`)
      .join('\n');
    return `**${h.count} assignment(s)** on file. Upcoming:\n${list}`;
  }

  if (
    snapshot.syllabus &&
    includesAny(q, ['syllabus', 'curriculum', 'chapter', 'unit', 'lesson plan', 'lessons'])
  ) {
    const s = snapshot.syllabus;
    if (s.units.length === 0) {
      return `No syllabus units are published yet. Teachers can add them under **Syllabus**.`;
    }
    const list = s.units
      .map(
        (u) =>
          `• **${u.title}** — ${u.subject} · ${u.classSection} · ${u.weekLabel} (${u.teacher})`
      )
      .join('\n');
    return `**Syllabus (${s.count} unit(s))**\n${list}\n\nOpen **Syllabus** to add or update chapters.`;
  }

  if (
    snapshot.notices &&
    includesAny(q, ['notice', 'notices', 'announcement', 'circular', 'bulletin'])
  ) {
    const n = snapshot.notices;
    if (n.latest.length === 0) {
      return `There are no notices posted yet for ${schoolName}.`;
    }
    const list = n.latest
      .map((item) => `• **${item.title}** — ${item.audience} · ${item.date}`)
      .join('\n');
    return `**${n.count} notice(s)** on the board. Latest:\n${list}\n\nManage under **Notices**.`;
  }

  if (
    snapshot.events &&
    includesAny(q, ['event', 'events', 'sports day', 'exhibition', 'cultural', 'happening'])
  ) {
    const e = snapshot.events;
    if (e.upcoming.length === 0) {
      return `No upcoming school events are published yet.`;
    }
    const list = e.upcoming
      .map((item) => `• **${item.title}** — ${item.date} @ ${item.location} (${item.category})`)
      .join('\n');
    return `**Upcoming events (${e.count})**\n${list}\n\nFull calendar is under **Community feed** / Events.`;
  }

  if (
    snapshot.feed &&
    includesAny(q, ['feed', 'community', 'social', 'post', 'posts', 'share'])
  ) {
    const f = snapshot.feed;
    const list = f.latest
      .map((item) => `• **${item.title}** — ${item.author} (${item.type})`)
      .join('\n');
    return `**Community feed (${f.count} post(s))**\n${list || 'No posts yet.'}\n\nTeachers and admins can publish updates under **Community feed**.`;
  }

  const feeIntent =
    snapshot.fees &&
    (includesAny(q, ['fee', 'fees', 'payment', 'outstanding', 'owe', 'balance', 'collect']) ||
      (includesAny(q, ['due', 'pending']) &&
        includesAny(q, ['fee', 'fees', 'payment', 'money', 'amount', 'month'])));

  if (feeIntent) {
    const f = snapshot.fees!;
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
    if (includesAny(q, ['overdue', 'late', 'defaulter'])) {
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

  if (
    includesAny(q, ['attendance', 'present', 'absent', 'late', 'mark', 'register'])
  ) {
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
      const absent = a.absentStudents ?? [];
      if (absent.length === 0) {
        return `Based on today's register (${a.date}), no absences are recorded for your child's class. Check **Attendance** for the full record.`;
      }
      return `Today's register (${a.date}): **${a.present} present**, **${a.absent} absent**, **${a.late} late** (total marked: ${a.total}). Open **Attendance** to see your child's status.`;
    }
    return `**Today's attendance (${a.date})**\n• Present: **${a.present}**\n• Absent: **${a.absent}**\n• Late: **${a.late}**\n• Total students marked: **${a.total}**${a.byClass ? `\n• By class: ${Object.entries(a.byClass).map(([c, v]) => `${c} (${v.present}P/${v.absent}A/${v.late}L)`).join(' · ')}` : ''}`;
  }

  if (snapshot.busRoutes && includesAny(q, ['bus', 'transport', 'route', 'gps', 'vehicle'])) {
    const b = snapshot.busRoutes;
    const list = b.routes
      .map((r) => `• **${r.name}** — ${r.driver}, ${r.vehicleNo} (${r.status})`)
      .join('\n');
    return `**Bus fleet (${b.count} routes)** — ${b.active} active now:\n${list}\n\nDrivers update GPS from My route; parents see live location under **Bus tracking**.`;
  }

  if (snapshot.timetable && includesAny(q, ['timetable', 'schedule', 'class today', 'period', 'periods'])) {
    const t = snapshot.timetable;
    if (t.todaySlots.length === 0) {
      return `No timetable slots for **${t.todayDay}** in the current schedule. Add periods under **Timetable**.`;
    }
    const list = t.todaySlots
      .map((s) => `• ${s.time} — **${s.subject}** (${s.classSection}) with ${s.teacher}, ${s.room}`)
      .join('\n');
    return `**${t.todayDay}'s schedule** (${t.count} slots total):\n${list}`;
  }

  if (snapshot.team && includesAny(q, ['team', 'staff', 'teacher', 'invite', 'member'])) {
    const t = snapshot.team;
    return `**Team — ${schoolName}**\n• Total members: **${t.total}**\n• Teachers: ${t.teachers} · Parents: ${t.parents} · Students: ${t.students} · Drivers: ${t.drivers}\n\nInvite new members under **User management**.`;
  }

  if (snapshot.subscription && includesAny(q, ['plan', 'subscription', 'trial', 'billing'])) {
    const s = snapshot.subscription;
    return `**Subscription**\n• Plan: **${s.planName}** (${s.status})\n• Students: ${s.studentCount} · Staff: ${s.teacherCount}${s.trialEndsAt ? `\n• Trial ends: ${s.trialEndsAt.slice(0, 10)}` : ''}\n\nManage billing under **Subscription**.`;
  }

  if (includesAny(q, ['leave', 'holiday'])) {
    return 'Apply for leave under **Leave requests**. Approved school holidays appear in the **Holiday calendar**.';
  }

  return `I can help with **fees**, **attendance**, **homework**, **syllabus**, **notices**, **events**, **community feed**, **bus routes**, **timetable**, and **team** for ${schoolName}. Try a suggestion below or ask something specific.`;
}
