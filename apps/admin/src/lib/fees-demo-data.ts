import type { StudentFeeAccount } from './types';

/** Sample student fee ledgers for local demo */
export function createDemoStudentFees(): StudentFeeAccount[] {
  const termDue = new Date();
  termDue.setMonth(termDue.getMonth() + 1);
  const due = termDue.toISOString().slice(0, 10);
  const pastDue = new Date();
  pastDue.setMonth(pastDue.getMonth() - 1);
  const overdue = pastDue.toISOString().slice(0, 10);

  return [
    {
      id: 'stu_1',
      studentName: 'Aarav Patel',
      classSection: '8-A',
      parentName: 'Rajesh Patel',
      parentPhone: '+91 98100 11111',
      lineItems: [
        { id: 'li_1', label: 'Tuition — Term 1', amount: 45000, dueDate: due },
        { id: 'li_2', label: 'Transport', amount: 12000, dueDate: due },
      ],
      payments: [
        {
          id: 'pay_1',
          date: new Date().toISOString().slice(0, 10),
          amount: 45000,
          mode: 'upi',
          reference: 'UPI-8821',
          recordedBy: 'Dr. Priya Sharma',
        },
      ],
    },
    {
      id: 'stu_2',
      studentName: 'Isha Sharma',
      classSection: '8-A',
      parentName: 'Neha Sharma',
      parentPhone: '+91 98100 22222',
      lineItems: [
        { id: 'li_3', label: 'Tuition — Term 1', amount: 45000, dueDate: due },
        { id: 'li_4', label: 'Lab fee', amount: 3500, dueDate: due },
      ],
      payments: [
        {
          id: 'pay_2',
          date: new Date().toISOString().slice(0, 10),
          amount: 25000,
          mode: 'bank',
          reference: 'NEFT-4412',
          recordedBy: 'Dr. Priya Sharma',
        },
      ],
    },
    {
      id: 'stu_3',
      studentName: 'Vihaan Khan',
      classSection: '6-B',
      parentName: 'Salman Khan',
      parentPhone: '+91 98100 33333',
      lineItems: [
        { id: 'li_5', label: 'Tuition — Term 1', amount: 42000, dueDate: overdue },
        { id: 'li_6', label: 'Activity fee', amount: 2500, dueDate: overdue },
      ],
      payments: [],
    },
    {
      id: 'stu_4',
      studentName: 'Ananya Reddy',
      classSection: '10-C',
      parentName: 'Lakshmi Reddy',
      parentPhone: '+91 98100 44444',
      lineItems: [
        { id: 'li_7', label: 'Tuition — Term 1', amount: 48000, dueDate: due },
        { id: 'li_8', label: 'Exam fee', amount: 2000, dueDate: due },
      ],
      payments: [
        {
          id: 'pay_3',
          date: new Date().toISOString().slice(0, 10),
          amount: 50000,
          mode: 'cash',
          recordedBy: 'Rahul Mehta',
        },
      ],
    },
    {
      id: 'stu_5',
      studentName: 'Rohan Das',
      classSection: '5-A',
      parentName: 'Priyanka Das',
      parentPhone: '+91 98100 55555',
      lineItems: [{ id: 'li_9', label: 'Tuition — Term 1', amount: 40000, dueDate: due }],
      payments: [],
    },
  ];
}
