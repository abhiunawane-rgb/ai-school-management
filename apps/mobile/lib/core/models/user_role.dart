enum UserRole {
  schoolAdmin('school_admin', 'School Admin', 'Manage school, billing, and invites'),
  subAdmin('sub_admin', 'Sub Admin', 'Invite staff and parents on behalf of principal'),
  teacher('teacher', 'Teacher', 'Attendance, homework, results, and class notices'),
  parent('parent', 'Parent', 'Child fees, bus location, homework, and notices'),
  student('student', 'Student', 'Timetable, homework, classes, and AI help'),
  driver('driver', 'Driver', 'Update live bus location for parents');

  const UserRole(this.id, this.label, this.description);
  final String id;
  final String label;
  final String description;

  static UserRole? fromId(String? id) {
    if (id == null) return null;
    for (final r in UserRole.values) {
      if (r.id == id) return r;
    }
    return null;
  }
}
