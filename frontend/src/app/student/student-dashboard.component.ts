import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Course } from '../shared/models/course.model';
import { CourseService } from '../courses/course.service';
import { EnrollmentService } from '../courses/enrollment.service';
import { CourseListComponent } from '../courses/course-list.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CourseListComponent],
  template: `
    <div class="student-dashboard">
      <div class="header">
        <h1>Student Dashboard</h1>
        <p>Welcome, {{ userName }}!</p>
      </div>

      <div class="tabs">
        <button
          *ngFor="let tab of ['available', 'enrolled']"
          [class.active]="activeTab === tab"
          (click)="activeTab = tab"
          class="tab-btn"
        >
          {{ tab === 'available' ? 'Available Courses' : 'My Courses' }}
        </button>
      </div>

      <div class="tab-content">
        <!-- Available Courses Tab -->
        <div *ngIf="activeTab === 'available'" class="tab-pane">
          <div *ngIf="loadingAvailable" class="loading">Loading available courses...</div>
          <div *ngIf="!loadingAvailable && errorAvailable" class="alert alert-error">
            {{ errorAvailable }}
          </div>
          <app-course-list
            *ngIf="!loadingAvailable && !errorAvailable"
            [courses]="availableCourses"
            emptyMessage="No available courses at this time"
            [showActionButton]="true"
            [actionButtonText]="getJoinButtonTexts()"
            (action)="joinCourse($event)"
          ></app-course-list>
        </div>

        <!-- My Courses Tab -->
        <div *ngIf="activeTab === 'enrolled'" class="tab-pane">
          <div *ngIf="loadingEnrolled" class="loading">Loading your courses...</div>
          <div *ngIf="!loadingEnrolled && errorEnrolled" class="alert alert-error">
            {{ errorEnrolled }}
          </div>
          <app-course-list
            *ngIf="!loadingEnrolled && !errorEnrolled"
            [courses]="enrolledCourses"
            emptyMessage="You are not enrolled in any courses yet"
          ></app-course-list>
        </div>
      </div>

      <div *ngIf="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
    </div>
  `,
  styles: [`
    .student-dashboard {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
    }

    .header h1 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .header p {
      margin: 0;
      color: #666;
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 2px solid #eee;
    }

    .tab-btn {
      padding: 12px 20px;
      border: none;
      background: none;
      color: #666;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
    }

    .tab-btn:hover {
      color: #333;
    }

    .tab-btn.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .tab-content {
      background: white;
      border-radius: 8px;
      padding: 0;
    }

    .tab-pane {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .alert {
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
      border-left: 4px solid;
    }

    .alert-success {
      background-color: #d4edda;
      border-left-color: #28a745;
      color: #155724;
    }

    .alert-error {
      background-color: #f8d7da;
      border-left-color: #dc3545;
      color: #721c24;
    }
  `]
})
export class StudentDashboardComponent implements OnInit {
  activeTab = 'available';
  availableCourses: Course[] = [];
  enrolledCourses: Course[] = [];
  loadingAvailable = false;
  loadingEnrolled = false;
  errorAvailable = '';
  errorEnrolled = '';
  successMessage = '';
  userName = 'Student';

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    this.loadAvailableCourses();
    this.loadEnrolledCourses();
  }

  private loadAvailableCourses(): void {
    this.loadingAvailable = true;
    this.errorAvailable = '';
    this.courseService.getAvailableCourses().subscribe({
      next: (courses) => {
        this.availableCourses = courses;
        this.loadingAvailable = false;
      },
      error: (error) => {
        this.errorAvailable = 'Failed to load available courses';
        this.loadingAvailable = false;
      }
    });
  }

  private loadEnrolledCourses(): void {
    this.loadingEnrolled = true;
    this.errorEnrolled = '';
    this.enrollmentService.getStudentCourses().subscribe({
      next: (courses) => {
        this.enrolledCourses = courses;
        this.loadingEnrolled = false;
      },
      error: (error) => {
        this.errorEnrolled = 'Failed to load your courses';
        this.loadingEnrolled = false;
      }
    });
  }

  joinCourse(course: Course): void {
    this.enrollmentService.joinCourse(course.id).subscribe({
      next: () => {
        this.successMessage = `Successfully joined ${course.name}`;
        this.loadAvailableCourses();
        this.loadEnrolledCourses();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        const message = error.error?.message || 'Failed to join course';
        alert(message);
      }
    });
  }

  getJoinButtonTexts(): { [key: number]: string } {
    const texts: { [key: number]: string } = {};
    this.availableCourses.forEach(course => {
      texts[course.id] = course.currentEnrollment >= course.maxStudents ? 'Full' : 'Join';
    });
    return texts;
  }
}
