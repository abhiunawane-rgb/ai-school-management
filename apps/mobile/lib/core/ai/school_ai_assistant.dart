import '../demo/academic_demo_data.dart';
import '../demo/calendar_demo_data.dart';
import '../models/user_role.dart';

class SchoolAiSnapshot {
  SchoolAiSnapshot({
    required this.schoolName,
    required this.role,
    required this.currency,
    required this.today,
    this.viewerName,
    this.totalFees,
    this.totalPaid,
    this.totalPending,
    this.dueThisMonth,
    this.studentFeeCount,
    this.paidCount,
    this.partialCount,
    this.pendingCount,
    this.overdueCount,
    this.topPendingStudent,
    this.topPendingAmount,
    this.attendancePresent,
    this.attendanceAbsent,
    this.attendanceLate,
    this.attendanceTotal,
    this.absentStudents = const [],
    this.homeworkCount = 0,
    this.homeworkUpcoming = const [],
    this.busRouteCount = 0,
    this.busActiveCount = 0,
    this.busRoutes = const [],
    this.timetableToday = const [],
    this.teamTotal = 0,
    this.teamTeachers = 0,
  });

  final String schoolName;
  final UserRole role;
  final String currency;
  final String today;
  final String? viewerName;
  final int? totalFees;
  final int? totalPaid;
  final int? totalPending;
  final int? dueThisMonth;
  final int? studentFeeCount;
  final int? paidCount;
  final int? partialCount;
  final int? pendingCount;
  final int? overdueCount;
  final String? topPendingStudent;
  final int? topPendingAmount;
  final int? attendancePresent;
  final int? attendanceAbsent;
  final int? attendanceLate;
  final int? attendanceTotal;
  final List<String> absentStudents;
  final int homeworkCount;
  final List<String> homeworkUpcoming;
  final int busRouteCount;
  final int busActiveCount;
  final List<String> busRoutes;
  final List<String> timetableToday;
  final int teamTotal;
  final int teamTeachers;
}

enum _Intent {
  greeting,
  homework,
  fees,
  bus,
  attendance,
  timetable,
  leave,
  unknown,
}

class SchoolAiAssistant {
  static List<String> suggestionPrompts(SchoolAiSnapshot s) {
    switch (s.role) {
      case UserRole.schoolAdmin:
      case UserRole.subAdmin:
        return [
          'What is total outstanding fees this month?',
          "Today's attendance summary",
          'Which students have overdue fees?',
          'Homework due this week',
          'Active bus routes',
        ];
      case UserRole.teacher:
        return [
          "Today's class timetable",
          'Students absent today',
          'Homework due this week',
          'How do I mark attendance?',
        ];
      case UserRole.parent:
        return [
          "What is my child's fee balance?",
          'Is my child present today?',
          'Homework due this week',
          'Bus route status',
        ];
      case UserRole.student:
        return [
          'Homework due this week',
          "Today's class schedule",
          'My attendance this month',
        ];
      case UserRole.driver:
        return [
          'My bus route details',
          'How do I update GPS?',
          'Apply for duty leave',
        ];
    }
  }

  static bool _word(String q, String term) {
    final escaped = RegExp.escape(term);
    return RegExp('(?:^|[^a-z0-9])$escaped(?:[^a-z0-9]|\$)', caseSensitive: false).hasMatch(q);
  }

  static bool _any(String q, List<String> terms) => terms.any((t) => q.contains(t));

  static _Intent _detect(String q) {
    if (_word(q, 'hello') || _word(q, 'hi') || _word(q, 'hey') || _word(q, 'help')) {
      return _Intent.greeting;
    }
    final scores = <_Intent, int>{};
    void bump(_Intent i, int n) => scores[i] = (scores[i] ?? 0) + n;

    if (_any(q, ['bus', 'transport', 'gps', 'vehicle', 'fleet'])) bump(_Intent.bus, 10);
    if (_any(q, ['bus']) && (_word(q, 'late') || _any(q, ['status', 'location', 'live', 'delay']))) {
      bump(_Intent.bus, 12);
    }
    if (_any(q, ['attendance', 'register', 'present', 'absent'])) bump(_Intent.attendance, 10);
    if (_word(q, 'late') && _any(q, ['student', 'class', 'marked', 'came', 'attendance'])) {
      bump(_Intent.attendance, 8);
    }
    if (_any(q, ['homework', 'assignment', 'worksheet'])) bump(_Intent.homework, 10);
    if (_word(q, 'due') && _any(q, ['homework', 'assignment', 'work', 'task', 'soon', 'week'])) {
      bump(_Intent.homework, 8);
    }
    if (_any(q, ['fee', 'fees', 'payment', 'outstanding', 'balance', 'collect'])) bump(_Intent.fees, 10);
    if ((_word(q, 'due') || _word(q, 'pending') || _word(q, 'overdue')) &&
        _any(q, ['fee', 'fees', 'payment', 'money', 'month'])) {
      bump(_Intent.fees, 8);
    }
    if (_any(q, ['timetable', 'schedule', 'period'])) bump(_Intent.timetable, 10);
    if (_word(q, 'leave') || _word(q, 'holiday')) bump(_Intent.leave, 8);

    _Intent best = _Intent.unknown;
    var bestScore = 0;
    scores.forEach((intent, score) {
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    });
    return bestScore >= 6 ? best : (bestScore > 0 ? best : _Intent.unknown);
  }

  static String answer(String question, SchoolAiSnapshot s) {
    final q = question.toLowerCase().trim();
    final intent = _detect(q);

    if (intent == _Intent.greeting) {
      return "Hello${s.viewerName != null ? ', ${s.viewerName}' : ''}! I'm your AI assistant for ${s.schoolName}. Ask about fees, attendance, homework, or buses — or tap a suggestion below.";
    }

    if (intent == _Intent.homework) {
      if (s.homeworkUpcoming.isEmpty) return 'No homework due right now.';
      return '${s.homeworkCount} assignment(s). Upcoming:\n${s.homeworkUpcoming.map((h) => '• $h').join('\n')}';
    }

    if (intent == _Intent.fees) {
      if (s.totalPending == null) return 'Fee data is not available yet.';
      final pending = _inr(s.totalPending!, s.currency);
      final month = _inr(s.dueThisMonth ?? 0, s.currency);
      if (_any(q, ['month', 'this month'])) {
        return 'Fee outstanding — ${s.today.substring(0, 7)}\n'
            '• Due this month: $month\n'
            '• Total pending: $pending\n'
            '• Collected: ${_inr(s.totalPaid ?? 0, s.currency)} of ${_inr(s.totalFees ?? 0, s.currency)}\n'
            '• ${s.paidCount ?? 0}/${s.studentFeeCount ?? 0} students fully paid';
      }
      if (_any(q, ['overdue', 'defaulter']) ||
          (_word(q, 'late') && _any(q, ['fee', 'fees', 'payment']))) {
        return '${s.overdueCount ?? 0} student(s) overdue. '
            'Total pending: $pending.'
            '${s.topPendingStudent != null ? ' Highest: ${s.topPendingStudent} — ${_inr(s.topPendingAmount ?? 0, s.currency)}.' : ''}';
      }
      if (s.role == UserRole.parent && _any(q, ['child', 'my'])) {
        if (s.topPendingStudent != null) {
          return '${s.topPendingStudent} has pending fees of ${_inr(s.topPendingAmount ?? 0, s.currency)}. Check Fees & pay in the app.';
        }
      }
      return 'Fee summary for ${s.schoolName}:\n'
          '• Outstanding: $pending\n'
          '• Due this month: $month\n'
          '• ${s.paidCount ?? 0} students fully paid';
    }

    if (intent == _Intent.bus) {
      if (s.busRoutes.isEmpty) {
        return 'No bus routes configured. Contact school transport desk.';
      }
      return '${s.busActiveCount}/${s.busRouteCount} routes active:\n${s.busRoutes.map((r) => '• $r').join('\n')}';
    }

    if (intent == _Intent.attendance) {
      if (s.attendanceTotal == null || s.attendanceTotal == 0) {
        return 'No attendance marked for today yet.';
      }
      final absent = s.absentStudents.isEmpty ? 'none' : s.absentStudents.join(', ');
      return "Today's attendance (${s.today}):\n"
          '• Present: ${s.attendancePresent}\n'
          '• Absent: ${s.attendanceAbsent} ($absent)\n'
          '• Late: ${s.attendanceLate}\n'
          '• Total: ${s.attendanceTotal}';
    }

    if (intent == _Intent.timetable) {
      if (s.timetableToday.isEmpty) {
        return 'No classes scheduled for today in the demo timetable.';
      }
      return "Today's schedule:\n${s.timetableToday.map((t) => '• $t').join('\n')}";
    }

    if (intent == _Intent.leave) {
      return 'Apply leave from Apply leave. School holidays are in Holiday calendar.';
    }

    return 'Ask about fees, attendance, homework, buses, or timetable for ${s.schoolName}. Try a suggestion chip!';
  }

  static SchoolAiSnapshot demoSnapshot({
    required String schoolName,
    required UserRole role,
    String? viewerName,
  }) {
    final fee = AcademicDemoData.parentFees();
    final homework = AcademicDemoData.homeworkForStudent();
    final roster = CalendarDemoData.classRoster();
    final today = DateTime.now();
    final todayKey =
        '${today.year}-${today.month.toString().padLeft(2, '0')}-${today.day.toString().padLeft(2, '0')}';

    return SchoolAiSnapshot(
      schoolName: schoolName,
      role: role,
      currency: 'INR',
      today: todayKey,
      viewerName: viewerName,
      totalFees: fee.total,
      totalPaid: fee.paid,
      totalPending: fee.pending,
      dueThisMonth: fee.pending,
      studentFeeCount: 5,
      paidCount: 2,
      partialCount: 1,
      pendingCount: 2,
      overdueCount: 1,
      topPendingStudent: fee.studentName,
      topPendingAmount: fee.pending,
      attendancePresent: roster.length - 1,
      attendanceAbsent: 1,
      attendanceLate: 1,
      attendanceTotal: roster.length + 1,
      absentStudents: const ['Sneha Rao'],
      homeworkCount: homework.length,
      homeworkUpcoming: homework
          .map((h) => '${h.title} — ${h.subject}, due ${h.dueDate}')
          .toList(),
      busRouteCount: 2,
      busActiveCount: 1,
      busRoutes: const [
        'Route A — Koregaon Park (active)',
        'Route B — Hinjewadi (idle)',
      ],
      timetableToday: AcademicDemoData.timetableMonday()
          .map((p) => 'Period ${p.period}: ${p.subject} with ${p.teacher}')
          .toList(),
      teamTotal: 12,
      teamTeachers: 4,
    );
  }

  static String _inr(int amount, String currency) {
    if (currency == 'INR') {
      return '₹${amount.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')}';
    }
    return '$currency $amount';
  }
}
