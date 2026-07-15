import type {
  CommunityPost,
  NoticeItem,
  SchoolEvent,
  SyllabusUnit,
} from './types';

export function createDemoNotices(): NoticeItem[] {
  const today = new Date();
  const d = (offset: number) => {
    const x = new Date(today);
    x.setDate(x.getDate() - offset);
    return x.toISOString().slice(0, 10);
  };
  return [
    {
      id: 'nt_1',
      title: 'Parent–teacher meeting',
      body: 'PTM for classes 6–8 on Saturday 10:00 AM in the auditorium. Please confirm attendance with class teachers.',
      audience: 'all',
      pinned: true,
      author: 'Principal office',
      createdAt: d(1),
    },
    {
      id: 'nt_2',
      title: 'Term 1 exam schedule published',
      body: 'The Term 1 assessment timetable is available under Timetable. Students should revise as per the syllabus units posted by subject teachers.',
      audience: 'students',
      pinned: false,
      author: 'Exam cell',
      createdAt: d(3),
    },
    {
      id: 'nt_3',
      title: 'Transport route update',
      body: 'Route A will start 10 minutes earlier from Monday due to road works near FC Road.',
      audience: 'parents',
      pinned: false,
      author: 'Transport desk',
      createdAt: d(5),
    },
  ];
}

export function createDemoSyllabus(): SyllabusUnit[] {
  return [
    {
      id: 'sy_1',
      classSection: '8-A',
      subject: 'Mathematics',
      title: 'Chapter 5 — Algebra',
      description: 'Linear equations, identities, and word problems. Complete textbook exercises 1–12.',
      weekLabel: 'Week 12',
      teacher: 'Rahul Mehta',
      resources: 'Worksheet PDF · Practice set',
    },
    {
      id: 'sy_2',
      classSection: '8-A',
      subject: 'Science',
      title: 'Unit 3 — Forces & Motion',
      description: 'Newton’s laws overview, classroom experiments, and lab notebook entry.',
      weekLabel: 'Week 12',
      teacher: 'Anita Desai',
      resources: 'Lab sheet · Video link',
    },
    {
      id: 'sy_3',
      classSection: '8-B',
      subject: 'English',
      title: 'Literature — Short stories',
      description: 'Reading comprehension and character analysis for the selected anthology.',
      weekLabel: 'Week 11–12',
      teacher: 'Priya Nair',
      resources: 'Anthology pages 40–58',
    },
  ];
}

export function createDemoEvents(): SchoolEvent[] {
  const today = new Date();
  const d = (offset: number) => {
    const x = new Date(today);
    x.setDate(x.getDate() + offset);
    return x.toISOString().slice(0, 10);
  };
  return [
    {
      id: 'ev_1',
      title: 'Annual Sports Day',
      date: d(12),
      time: '08:00 AM',
      location: 'Main ground',
      description: 'Track & field, march-past, and house competitions. Parents welcome.',
      category: 'sports',
    },
    {
      id: 'ev_2',
      title: 'Science exhibition',
      date: d(20),
      time: '11:00 AM',
      location: 'Lab block',
      description: 'Student projects from grades 6–10. Certificates for top exhibits.',
      category: 'academic',
    },
    {
      id: 'ev_3',
      title: 'Cultural evening',
      date: d(28),
      time: '05:30 PM',
      location: 'Auditorium',
      description: 'Dance, music, and drama performances by house teams.',
      category: 'cultural',
    },
  ];
}

export function createDemoFeed(): CommunityPost[] {
  const now = Date.now();
  return [
    {
      id: 'fp_1',
      type: 'announcement',
      author: 'Dr. Priya Sharma',
      authorRole: 'school_admin',
      title: 'Welcome to the school community feed',
      body: 'Share school moments, celebrate wins, and keep families updated. Teachers can post class highlights; admins can pin important updates.',
      createdAt: new Date(now - 2 * 3600_000).toISOString(),
      likes: 12,
      pinned: true,
    },
    {
      id: 'fp_2',
      type: 'event',
      author: 'Sports dept',
      authorRole: 'teacher',
      title: 'Sports Day practice starts Monday',
      body: 'Selected students for march-past must report at 7:30 AM. Bring house T-shirts.',
      createdAt: new Date(now - 26 * 3600_000).toISOString(),
      likes: 8,
      pinned: false,
    },
    {
      id: 'fp_3',
      type: 'post',
      author: 'Rahul Mehta',
      authorRole: 'teacher',
      title: 'Class 8-A algebra tip of the week',
      body: 'Remember: keep both sides balanced when solving equations. Practice set uploaded under Syllabus.',
      createdAt: new Date(now - 50 * 3600_000).toISOString(),
      likes: 15,
      pinned: false,
    },
  ];
}
