class HomeworkItem {
  HomeworkItem({
    required this.title,
    required this.subject,
    required this.dueDate,
    required this.description,
  });

  final String title;
  final String subject;
  final String dueDate;
  final String description;
}

class NoticeItem {
  NoticeItem({
    required this.title,
    required this.body,
    required this.date,
    required this.author,
  });

  final String title;
  final String body;
  final String date;
  final String author;
}

class TimetablePeriod {
  TimetablePeriod({
    required this.period,
    required this.subject,
    required this.teacher,
    required this.room,
  });

  final int period;
  final String subject;
  final String teacher;
  final String room;
}

class FeeSummary {
  FeeSummary({
    required this.studentName,
    required this.total,
    required this.paid,
    required this.pending,
    required this.status,
  });

  final String studentName;
  final int total;
  final int paid;
  final int pending;
  final String status;
}

class AcademicDemoData {
  static List<HomeworkItem> homeworkForStudent() => [
    HomeworkItem(
      title: 'Algebra worksheet — Chapter 5',
      subject: 'Mathematics',
      dueDate: '2026-06-02',
      description: 'Complete exercises 1–12. Show all steps.',
    ),
    HomeworkItem(
      title: 'Essay: My favourite book',
      subject: 'English',
      dueDate: '2026-06-05',
      description: '300–400 words.',
    ),
  ];

  static List<NoticeItem> notices() => [
    NoticeItem(
      title: 'Parent–teacher meeting',
      body: 'PTM for classes 6–8 on Saturday 10:00 AM in the auditorium.',
      date: '2026-05-28',
      author: 'Principal office',
    ),
    NoticeItem(
      title: 'Sports day practice',
      body: 'Students selected for march-past must report at 7:30 AM.',
      date: '2026-05-25',
      author: 'Sports dept',
    ),
  ];

  static List<TimetablePeriod> timetableMonday() => [
    TimetablePeriod(period: 1, subject: 'Mathematics', teacher: 'Rahul Mehta', room: '201'),
    TimetablePeriod(period: 2, subject: 'Science', teacher: 'Anita Desai', room: 'Lab 1'),
    TimetablePeriod(period: 3, subject: 'English', teacher: 'Priya Nair', room: '105'),
    TimetablePeriod(period: 4, subject: 'Hindi', teacher: 'Vikram Joshi', room: '102'),
  ];

  static FeeSummary parentFees() => FeeSummary(
        studentName: 'Aarav Patel',
        total: 45000,
        paid: 30000,
        pending: 15000,
        status: 'partial',
      );
}
