import type { SchoolFeeSummary, StudentFeeAccount, StudentFeeStatus } from './types';

export function studentFeeTotals(account: StudentFeeAccount) {
  const totalFees = account.lineItems.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = account.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pending = Math.max(0, totalFees - totalPaid);
  const status = feeStatus(totalFees, totalPaid, pending, account.lineItems);
  return { totalFees, totalPaid, pending, status };
}

function feeStatus(
  totalFees: number,
  totalPaid: number,
  pending: number,
  lineItems: StudentFeeAccount['lineItems']
): StudentFeeStatus {
  if (totalFees === 0) return 'pending';
  if (pending === 0) return 'paid';
  if (totalPaid > 0) return 'partial';
  const today = new Date().toISOString().slice(0, 10);
  const overdue = lineItems.some((item) => item.dueDate < today);
  return overdue ? 'overdue' : 'pending';
}

export function schoolFeeSummary(accounts: StudentFeeAccount[]): SchoolFeeSummary {
  let totalFees = 0;
  let totalPaid = 0;
  let paidCount = 0;
  let partialCount = 0;
  let pendingCount = 0;

  for (const account of accounts) {
    const totals = studentFeeTotals(account);
    totalFees += totals.totalFees;
    totalPaid += totals.totalPaid;
    if (totals.status === 'paid') paidCount += 1;
    else if (totals.status === 'partial') partialCount += 1;
    else pendingCount += 1;
  }

  return {
    totalFees,
    totalPaid,
    totalPending: Math.max(0, totalFees - totalPaid),
    studentCount: accounts.length,
    paidCount,
    partialCount,
    pendingCount,
  };
}
