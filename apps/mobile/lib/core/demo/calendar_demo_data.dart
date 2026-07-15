import '../models/calendar_models.dart';
import '../models/user_role.dart';

class CalendarDemoData {
  static List<ClassStudent> classRoster() => [
        ClassStudent(id: 's1', name: 'Aarav Patel', classSection: '8-A'),
        ClassStudent(id: 's2', name: 'Isha Sharma', classSection: '8-A'),
        ClassStudent(id: 's3', name: 'Vihaan Khan', classSection: '8-A'),
        ClassStudent(id: 's4', name: 'Ananya Reddy', classSection: '8-A'),
        ClassStudent(id: 's5', name: 'Rohan Das', classSection: '8-A'),
      ];

  static List<SchoolHoliday> holidays() {
    final year = DateTime.now().year;
    return [
      SchoolHoliday(date: DateTime(year, 1, 26), title: 'Republic Day'),
      SchoolHoliday(date: DateTime(year, 3, 14), title: 'Holi'),
      SchoolHoliday(date: DateTime(year, 8, 15), title: 'Independence Day'),
      SchoolHoliday(date: DateTime(year, 10, 2), title: 'Gandhi Jayanti'),
      SchoolHoliday(date: DateTime(year, 10, 20), title: 'Diwali break', isOptional: false),
      SchoolHoliday(date: DateTime(year, 10, 21), title: 'Diwali break'),
      SchoolHoliday(date: DateTime(year, 10, 22), title: 'Diwali break'),
      SchoolHoliday(date: DateTime(year, 12, 25), title: 'Christmas'),
      SchoolHoliday(date: DateTime(year, 12, 31), title: 'New Year Eve (half day)', isOptional: true),
    ];
  }

  static List<LeaveRequest> seedLeaves() {
    final now = DateTime.now();
    return [
      LeaveRequest(
        id: 'lv_1',
        from: now.subtract(const Duration(days: 12)),
        to: now.subtract(const Duration(days: 10)),
        reason: 'Family function',
        status: LeaveStatus.approved,
        appliedAt: now.subtract(const Duration(days: 15)),
      ),
    ];
  }

  /// Last 30 weekdays attendance pattern for demo
  static List<DailyAttendance> personalAttendance(UserRole role) {
    final holidays = holidays();
    final holidayDates = holidays.map((h) => _dateKey(h.date)).toSet();
    final list = <DailyAttendance>[];
    final today = DateTime.now();

    for (var i = 29; i >= 0; i--) {
      final d = DateTime(today.year, today.month, today.day).subtract(Duration(days: i));
      if (d.weekday == DateTime.saturday || d.weekday == DateTime.sunday) continue;
      if (holidayDates.contains(_dateKey(d))) {
        list.add(DailyAttendance(date: d, status: AttendanceMark.holiday, note: 'School holiday'));
        continue;
      }
      final status = _patternStatus(role, i);
      list.add(DailyAttendance(date: d, status: status));
    }
    return list;
  }

  static AttendanceMark _patternStatus(UserRole role, int dayIndex) {
    if (dayIndex == 3) return AttendanceMark.onLeave;
    if (dayIndex == 7) return AttendanceMark.late;
    if (role == UserRole.driver && dayIndex == 14) return AttendanceMark.absent;
    if (dayIndex == 21 && role == UserRole.student) return AttendanceMark.absent;
    return AttendanceMark.present;
  }

  static String _dateKey(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  static List<DailyAttendance> childAttendanceForParent() => personalAttendance(UserRole.student);
}
