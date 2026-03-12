import { CourseSchedule } from './course-schedule.model';

export interface Course {
  id: number;
  name: string;
  description: string;
  teacherId: number;
  status: string;
  maxStudents: number;
  currentEnrollment: number;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: number;
  schedules: CourseSchedule[];
}
