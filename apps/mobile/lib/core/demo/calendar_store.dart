import 'dart:convert';

import 'package:hive_flutter/hive_flutter.dart';

import '../models/calendar_models.dart';
import '../models/user_role.dart';
import 'calendar_demo_data.dart';

class CalendarStore {
  static const _boxName = 'aischool_mobile';
  static const _leavesKey = 'leave_requests';
  static const _classAttendancePrefix = 'class_att_';

  static Box<String> get _box => Hive.box<String>(_boxName);

  static List<SchoolHoliday> holidays() => CalendarDemoData.holidays();

  static bool isHoliday(DateTime date) {
    final key = _dateKey(date);
    return holidays().any((h) => _dateKey(h.date) == key);
  }

  static List<DailyAttendance> personalAttendance(UserRole role) {
    if (role == UserRole.parent) {
      return CalendarDemoData.childAttendanceForParent();
    }
    return CalendarDemoData.personalAttendance(role);
  }

  static List<ClassStudent> classRoster() => CalendarDemoData.classRoster();

  static Future<List<LeaveRequest>> loadLeaves() async {
    final raw = _box.get(_leavesKey);
    if (raw == null) {
      final seed = CalendarDemoData.seedLeaves();
      await _saveLeaves(seed);
      return seed;
    }
    final list = jsonDecode(raw) as List<dynamic>;
    return list.map((e) => LeaveRequest.fromJson(e as Map<String, dynamic>)).toList()
      ..sort((a, b) => b.appliedAt.compareTo(a.appliedAt));
  }

  static Future<void> addLeave({
    required DateTime from,
    required DateTime to,
    required String reason,
  }) async {
    final existing = await loadLeaves();
    final entry = LeaveRequest(
      id: 'lv_${DateTime.now().millisecondsSinceEpoch}',
      from: from,
      to: to,
      reason: reason,
      status: LeaveStatus.pending,
      appliedAt: DateTime.now(),
    );
    await _saveLeaves([entry, ...existing]);
  }

  static Future<void> _saveLeaves(List<LeaveRequest> leaves) async {
    await _box.put(_leavesKey, jsonEncode(leaves.map((l) => l.toJson()).toList()));
  }

  static String classAttendanceKey(DateTime date) =>
      '$_classAttendancePrefix${_dateKey(date)}';

  static Future<Map<String, AttendanceMark>> loadClassAttendance(DateTime date) async {
    final raw = _box.get(classAttendanceKey(date));
    if (raw == null) return {};
    final map = jsonDecode(raw) as Map<String, dynamic>;
    return map.map((k, v) => MapEntry(k, AttendanceMark.values.byName(v as String)));
  }

  static Future<void> saveClassAttendance(
    DateTime date,
    Map<String, AttendanceMark> marks,
  ) async {
    await _box.put(
      classAttendanceKey(date),
      jsonEncode(marks.map((k, v) => MapEntry(k, v.name))),
    );
  }

  static String _dateKey(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  static AttendanceSummary summarize(List<DailyAttendance> records) {
    var present = 0;
    var absent = 0;
    var late = 0;
    var leave = 0;
    var holiday = 0;
    for (final r in records) {
      switch (r.status) {
        case AttendanceMark.present:
          present++;
        case AttendanceMark.absent:
          absent++;
        case AttendanceMark.late:
          late++;
        case AttendanceMark.onLeave:
          leave++;
        case AttendanceMark.holiday:
          holiday++;
      }
    }
    final working = present + absent + late + leave;
    final pct = working == 0 ? 100.0 : (present + late * 0.5) / working * 100;
    return AttendanceSummary(
      present: present,
      absent: absent,
      late: late,
      onLeave: leave,
      holidays: holiday,
      attendancePercent: pct.clamp(0, 100),
    );
  }
}

class AttendanceSummary {
  AttendanceSummary({
    required this.present,
    required this.absent,
    required this.late,
    required this.onLeave,
    required this.holidays,
    required this.attendancePercent,
  });

  final int present;
  final int absent;
  final int late;
  final int onLeave;
  final int holidays;
  final double attendancePercent;
}
