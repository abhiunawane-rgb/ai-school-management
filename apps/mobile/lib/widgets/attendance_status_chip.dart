import 'package:flutter/material.dart';

import '../core/models/calendar_models.dart';

class AttendanceStatusChip extends StatelessWidget {
  const AttendanceStatusChip({super.key, required this.status, this.compact = false});

  final AttendanceMark status;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = _colors(status);
    return Container(
      padding: EdgeInsets.symmetric(horizontal: compact ? 8 : 10, vertical: compact ? 2 : 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        status.label,
        style: TextStyle(
          fontSize: compact ? 10 : 12,
          fontWeight: FontWeight.w600,
          color: fg,
        ),
      ),
    );
  }

  (Color, Color) _colors(AttendanceMark s) {
    switch (s) {
      case AttendanceMark.present:
        return (Colors.green.shade100, Colors.green.shade900);
      case AttendanceMark.absent:
        return (Colors.red.shade100, Colors.red.shade900);
      case AttendanceMark.late:
        return (Colors.orange.shade100, Colors.orange.shade900);
      case AttendanceMark.onLeave:
        return (Colors.blue.shade100, Colors.blue.shade900);
      case AttendanceMark.holiday:
        return (Colors.purple.shade100, Colors.purple.shade900);
    }
  }
}
