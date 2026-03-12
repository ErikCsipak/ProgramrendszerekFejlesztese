export interface CourseSchedule {
  id: number;
  courseId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
}
