import { GRADE_NUMERIC } from './constants/index.js';
import type { GradeLevel, StudentLoginMode } from './types/student.js';

/**
 * Student login rules:
 * - Nursery–4: parent account only
 * - 5–8: optional student login
 * - 9+: full student login required
 */
export function getStudentLoginMode(grade: GradeLevel): StudentLoginMode {
  const level = GRADE_NUMERIC[grade] ?? 0;
  if (level <= 4) return 'parent_only';
  if (level <= 8) return 'optional';
  return 'full';
}

export function canStudentLogin(grade: GradeLevel, hasLinkedUser: boolean): boolean {
  const mode = getStudentLoginMode(grade);
  if (mode === 'parent_only') return false;
  if (mode === 'optional') return hasLinkedUser;
  return true;
}

export function requiresParentAccount(grade: GradeLevel): boolean {
  return getStudentLoginMode(grade) === 'parent_only';
}
