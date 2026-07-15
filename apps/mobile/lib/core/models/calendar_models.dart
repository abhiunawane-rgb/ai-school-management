enum AttendanceMark {
  present,
  absent,
  late,
  onLeave,
  holiday;

  String get label {
    switch (this) {
      case AttendanceMark.present:
        return 'Present';
      case AttendanceMark.absent:
        return 'Absent';
      case AttendanceMark.late:
        return 'Late';
      case AttendanceMark.onLeave:
        return 'On leave';
      case AttendanceMark.holiday:
        return 'Holiday';
    }
  }
}

enum LeaveStatus { pending, approved, rejected }

class DailyAttendance {
  DailyAttendance({
    required this.date,
    required this.status,
    this.note,
  });

  final DateTime date;
  final AttendanceMark status;
  final String? note;

  Map<String, dynamic> toJson() => {
        'date': date.toIso8601String(),
        'status': status.name,
        'note': note,
      };

  factory DailyAttendance.fromJson(Map<String, dynamic> j) => DailyAttendance(
        date: DateTime.parse(j['date'] as String),
        status: AttendanceMark.values.byName(j['status'] as String),
        note: j['note'] as String?,
      );
}

class LeaveRequest {
  LeaveRequest({
    required this.id,
    required this.from,
    required this.to,
    required this.reason,
    required this.status,
    required this.appliedAt,
  });

  final String id;
  final DateTime from;
  final DateTime to;
  final String reason;
  final LeaveStatus status;
  final DateTime appliedAt;

  Map<String, dynamic> toJson() => {
        'id': id,
        'from': from.toIso8601String(),
        'to': to.toIso8601String(),
        'reason': reason,
        'status': status.name,
        'appliedAt': appliedAt.toIso8601String(),
      };

  factory LeaveRequest.fromJson(Map<String, dynamic> j) => LeaveRequest(
        id: j['id'] as String,
        from: DateTime.parse(j['from'] as String),
        to: DateTime.parse(j['to'] as String),
        reason: j['reason'] as String,
        status: LeaveStatus.values.byName(j['status'] as String),
        appliedAt: DateTime.parse(j['appliedAt'] as String),
      );
}

class SchoolHoliday {
  SchoolHoliday({
    required this.date,
    required this.title,
    this.isOptional = false,
  });

  final DateTime date;
  final String title;
  final bool isOptional;

  Map<String, dynamic> toJson() => {
        'date': date.toIso8601String(),
        'title': title,
        'isOptional': isOptional,
      };

  factory SchoolHoliday.fromJson(Map<String, dynamic> j) => SchoolHoliday(
        date: DateTime.parse(j['date'] as String),
        title: j['title'] as String,
        isOptional: j['isOptional'] as bool? ?? false,
      );
}

class ClassStudent {
  ClassStudent({required this.id, required this.name, required this.classSection});

  final String id;
  final String name;
  final String classSection;
}
