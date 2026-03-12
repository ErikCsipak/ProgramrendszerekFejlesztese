import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../shared/models/course.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAvailableCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/available`);
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/all`);
  }

  getTeacherCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/mine`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}`);
  }

  createCourse(course: any): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses`, course);
  }

  updateCourse(id: number, course: any): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${id}`);
  }

  getPendingCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/admin/pending-courses`);
  }

  approveCourse(id: number): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/admin/courses/${id}/approve`, {});
  }

  rejectCourse(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin/courses/${id}/reject`, {});
  }
}
