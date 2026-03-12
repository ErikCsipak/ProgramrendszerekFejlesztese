import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../shared/models/course.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStudentCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/enrollments/my-courses`);
  }

  joinCourse(courseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/enrollments/courses/${courseId}/join`, {});
  }

  leaveCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/enrollments/courses/${courseId}/leave`);
  }

  getEnrolledStudents(courseId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/enrollments/courses/${courseId}/students`);
  }
}
