export type GradeLevel =
  | 'nursery'
  | 'lkg'
  | 'ukg'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12';

export type StudentLoginMode = 'parent_only' | 'optional' | 'full';

export interface Student {
  id: string;
  tenantId: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  grade: GradeLevel;
  sectionId: string;
  parentIds: string[];
  userId?: string;
  loginMode: StudentLoginMode;
  busRouteId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
