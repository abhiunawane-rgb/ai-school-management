export const GRADES = [
  'Nursery',
  'LKG',
  'UKG',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
] as const;

export const DIVISIONS = ['A', 'B', 'C', 'D', 'E'] as const;

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Hindi',
  'Social Studies',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Physical Education',
  'Art & Craft',
  'Music',
  'French',
  'Sanskrit',
  'Economics',
  'Accountancy',
  'Business Studies',
  'Environmental Studies',
  'Moral Science',
  'Library',
] as const;

export const BOARDS = [
  'CBSE',
  'ICSE',
  'ISC',
  'IB',
  'IGCSE',
  'Cambridge',
  'State Board',
  'NIOS',
  'Montessori',
  'Other',
] as const;

export const CITIES = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Dubai',
  'Abu Dhabi',
  'London',
  'New York',
  'Singapore',
  'Sydney',
  'Other',
] as const;

export const FEE_LABELS = [
  'Tuition — Term 1',
  'Tuition — Term 2',
  'Tuition — Term 3',
  'Annual fees',
  'Transport fees',
  'Lab fees',
  'Sports fees',
  'Exam fees',
  'Admission fees',
  'Development fees',
] as const;

export const FEE_AMOUNTS_INR = [
  5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000,
] as const;

export const PAYMENT_MODES = [
  { value: 'upi', label: 'UPI' },
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank', label: 'Bank transfer' },
] as const;

export const LEAVE_REASONS = [
  'Medical / sick leave',
  'Family function',
  'Personal emergency',
  'Religious observance',
  'Travel',
  'Other',
] as const;

export const DUE_IN_DAYS = [
  { value: '3', label: 'Due in 3 days' },
  { value: '7', label: 'Due in 1 week' },
  { value: '14', label: 'Due in 2 weeks' },
  { value: '30', label: 'Due in 1 month' },
] as const;

export const INQUIRY_TOPICS = [
  'Pricing & plans',
  'Product demo',
  'Technical support',
  'Partnership',
  'Billing',
  'Other',
] as const;

export function formatClassSection(grade: string, division: string): string {
  return `${grade}-${division}`;
}

export function getClassSectionOptions(): { value: string; label: string }[] {
  return GRADES.flatMap((grade) =>
    DIVISIONS.map((division) => ({
      value: formatClassSection(grade, division),
      label: `Grade ${grade} — Section ${division}`,
    }))
  );
}

export function dueDateFromDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function parseClassSection(classSection: string): { grade: string; division: string } {
  const [grade, division] = classSection.split('-');
  return { grade: grade ?? '8', division: division ?? 'A' };
}
