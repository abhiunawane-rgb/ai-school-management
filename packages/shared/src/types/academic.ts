export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
  createdAt: string;
}

export interface TimetableSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  room?: string;
}

export interface Homework {
  id: string;
  tenantId: string;
  classId: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  attachments: string[];
  createdBy: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  tenantId: string;
  title: string;
  body: string;
  targetRoles: string[];
  targetClassIds?: string[];
  publishedAt: string;
  expiresAt?: string;
  createdBy: string;
}

export interface ExamResult {
  id: string;
  tenantId: string;
  studentId: string;
  examId: string;
  subjectId: string;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
  publishedAt: string;
}

export interface FeeInvoice {
  id: string;
  tenantId: string;
  studentId: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  providerPaymentId?: string;
  paidAt?: string;
}
