import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Course } from '../shared/models/course.model';
import { CourseService } from '../courses/course.service';
import { CourseListComponent } from '../courses/course-list.component';

@Component({
    selector: 'app-teacher-dashboard',
    imports: [CommonModule, RouterModule, FormsModule, CourseListComponent],
    template: `
    <div class="teacher-dashboard">
      <div class="header">
        <h1>Teacher Dashboard</h1>
        <p>Manage your courses</p>
        <button class="btn-primary" (click)="toggleNewCourseForm()">
          {{ showNewCourseForm ? 'Cancel' : 'Create New Course' }}
        </button>
      </div>

      <!-- Create Course Form -->
      <div *ngIf="showNewCourseForm" class="new-course-form card">
        <div class="form-title">Create New Course</div>

        <div class="form-group">
          <label for="courseName">Course Name</label>
          <input
            type="text"
            id="courseName"
            [(ngModel)]="newCourse.name"
            placeholder="Enter course name"
          />
        </div>

        <div class="form-group">
          <label for="courseDesc">Description</label>
          <textarea
            id="courseDesc"
            [(ngModel)]="newCourse.description"
            placeholder="Enter course description"
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="maxStudents">Max Students</label>
          <input
            type="number"
            id="maxStudents"
            [(ngModel)]="newCourse.maxStudents"
            min="1"
            placeholder="Maximum number of students"
          />
        </div>

        <div class="form-group">
          <label>Course Schedules</label>
          <div *ngFor="let schedule of newCourse.schedules; let i = index" class="schedule-input">
            <input
              type="text"
              [(ngModel)]="schedule.dayOfWeek"
              placeholder="Day (e.g., Monday)"
            />
            <input
              type="time"
              [(ngModel)]="schedule.startTime"
            />
            <input
              type="time"
              [(ngModel)]="schedule.endTime"
            />
            <input
              type="text"
              [(ngModel)]="schedule.location"
              placeholder="Location"
            />
            <button type="button" class="btn-remove" (click)="removeSchedule(i)">Remove</button>
          </div>
          <button type="button" class="btn-secondary" (click)="addSchedule()">Add Schedule</button>
        </div>

        <div class="form-actions">
          <button class="btn-primary" (click)="createCourse()" [disabled]="creatingCourse">
            {{ creatingCourse ? 'Creating...' : 'Create Course' }}
          </button>
          <button class="btn-secondary" (click)="toggleNewCourseForm()">Cancel</button>
        </div>

        <div *ngIf="formError" class="alert alert-error">
          {{ formError }}
        </div>
      </div>

      <!-- Courses List -->
      <div class="courses-section">
        <h2>Your Courses</h2>

        <div *ngIf="loading" class="loading">Loading your courses...</div>
        <div *ngIf="!loading && error" class="alert alert-error">
          {{ error }}
        </div>

        <div *ngIf="!loading && courses.length === 0" class="no-courses">
          You haven't created any courses yet
        </div>

        <div *ngIf="!loading && courses.length > 0" class="courses-list">
          <div *ngFor="let course of courses" class="course-item">
            <div class="course-info">
              <h3>{{ course.name }}</h3>
              <p>{{ course.description }}</p>
              <div class="course-stats">
                <span>Status: <strong>{{ course.status }}</strong></span>
                <span>Students: <strong>{{ course.currentEnrollment }} / {{ course.maxStudents }}</strong></span>
              </div>
            </div>

            <div class="course-actions">
              <button class="btn-small" [routerLink]="['/courses', course.id]">
                View Details
              </button>
              <button
                *ngIf="course.status === 'IN_PLAN'"
                class="btn-small"
                (click)="editCourse(course)"
              >
                Edit
              </button>
              <button
                class="btn-small danger"
                (click)="deleteCourse(course.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .teacher-dashboard {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .header p {
      margin: 5px 0 0 0;
      color: #666;
    }

    .btn-primary {
      padding: 10px 20px;
      background-color: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-primary:hover {
      background-color: #5568d3;
    }

    .new-course-form {
      background: white;
      padding: 25px;
      margin-bottom: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #333;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .schedule-input {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .schedule-input input {
      flex: 1;
      min-width: 100px;
    }

    .btn-remove {
      padding: 8px 12px;
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    .btn-secondary {
      padding: 10px 15px;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .form-actions button {
      flex: 1;
    }

    .courses-section {
      margin-top: 30px;
    }

    .courses-section h2 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .courses-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .course-item {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }

    .course-info {
      flex: 1;
    }

    .course-info h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .course-info p {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
    }

    .course-stats {
      display: flex;
      gap: 20px;
      font-size: 13px;
      color: #666;
    }

    .course-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn-small {
      padding: 8px 15px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-small:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .btn-small.danger {
      border-color: #dc3545;
      color: #dc3545;
    }

    .btn-small.danger:hover {
      background-color: #dc3545;
      color: white;
    }

    .loading,
    .no-courses {
      text-align: center;
      padding: 40px;
      color: #666;
      background: white;
      border-radius: 8px;
    }

    .alert {
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
      border-left: 4px solid;
    }

    .alert-error {
      background-color: #f8d7da;
      border-left-color: #dc3545;
      color: #721c24;
    }
  `]
})
export class TeacherDashboardComponent implements OnInit {
  courses: Course[] = [];
  loading = false;
  error = '';
  showNewCourseForm = false;
  creatingCourse = false;
  formError = '';

  newCourse = {
    name: '',
    description: '',
    maxStudents: 30,
    schedules: [{ dayOfWeek: '', startTime: '', endTime: '', location: '' }]
  };

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.loading = true;
    this.error = '';
    this.courseService.getTeacherCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load courses';
        this.loading = false;
      }
    });
  }

  toggleNewCourseForm(): void {
    this.showNewCourseForm = !this.showNewCourseForm;
    if (!this.showNewCourseForm) {
      this.resetForm();
    }
  }

  addSchedule(): void {
    this.newCourse.schedules.push({ dayOfWeek: '', startTime: '', endTime: '', location: '' });
  }

  removeSchedule(index: number): void {
    this.newCourse.schedules.splice(index, 1);
  }

  createCourse(): void {
    if (!this.newCourse.name || !this.newCourse.maxStudents) {
      this.formError = 'Course name and max students are required';
      return;
    }

    this.creatingCourse = true;
    this.formError = '';

    this.courseService.createCourse(this.newCourse).subscribe({
      next: () => {
        this.creatingCourse = false;
        this.resetForm();
        this.toggleNewCourseForm();
        this.loadCourses();
      },
      error: (error) => {
        this.formError = error.error?.message || 'Failed to create course';
        this.creatingCourse = false;
      }
    });
  }

  editCourse(course: Course): void {
    this.router.navigate(['/teacher/courses', course.id, 'edit']);
  }

  deleteCourse(courseId: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          this.loadCourses();
        },
        error: (error) => {
          alert(error.error?.message || 'Failed to delete course');
        }
      });
    }
  }

  private resetForm(): void {
    this.newCourse = {
      name: '',
      description: '',
      maxStudents: 30,
      schedules: [{ dayOfWeek: '', startTime: '', endTime: '', location: '' }]
    };
    this.formError = '';
  }
}
