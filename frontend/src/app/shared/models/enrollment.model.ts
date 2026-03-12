export interface Enrollment {
  id: number;
  courseId: number;
  studentId: number;
  enrolledAt: string;
  grade?: string;
}
