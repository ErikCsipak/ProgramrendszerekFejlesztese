import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Course } from '../shared/models/course.model';
import { EnrollmentService } from './enrollment.service';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-course-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="course-list-container">
      <div *ngIf="courses.length === 0" class="no-courses">
        {{ emptyMessage }}
      </div>

      <div *ngIf="courses.length > 0" class="courses-grid">
        <div *ngFor="let course of courses" class="course-card">
              <div class="course-card-header">
                <h3>{{ course.name }}</h3>
                <ng-container *ngIf="showStatusBadge">
                  <ng-container *ngIf="enrolledCourseIds && enrolledCourseIds.indexOf(course.id) !== -1; else statusBadge">
                    <span class="badge badge-enrolled">Already enrolled</span>
                  </ng-container>
                  <ng-template #statusBadge>
                    <span class="badge" [ngClass]="'badge-' + course.status.toLowerCase()">
                      {{ course.status }}
                    </span>
                  </ng-template>
                </ng-container>
              </div>
              <div class="course-card-body">
                <p class="description">{{ course.description || 'No description' }}</p>
                <div class="course-meta">
                  <div class="meta-item">
                    <span class="label">Students:</span>
                    <span class="value">{{ course.currentEnrollment }} / {{ course.maxStudents }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="label">Status:</span>
                    <span class="value">{{ course.status }}</span>
                  </div>
                </div>
                <div class="progress-bar">
                  <div class="progress" [style.width.%]="(course.currentEnrollment / course.maxStudents) * 100"></div>
                </div>
              </div>
              <div class="course-card-footer">
                <button class="btn-small" [routerLink]="['/courses', course.id]">
                  View Details
                </button>
                <button *ngIf="showActionButton && !(hideActionIfEnrolled && enrolledCourseIds && enrolledCourseIds.indexOf(course.id) !== -1)"
                  class="btn-small primary"
                  (click)="onAction(course)"
                  [disabled]="isActionDisabled(course)">
                  {{ getActionButtonText(course) }}
                </button>
              </div>
            </div>
        </div>
    </div>
    `,
    styles: [`
    .course-list-container {
      padding: 20px;
    }

    .no-courses {
      text-align: center;
      padding: 60px 20px;
      color: #999;
      font-size: 16px;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .course-card {
      background: white;
      border: 1px solid #eee;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
    }

    .course-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .course-card-header {
      padding: 15px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
    }

    .course-card-header h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
      flex: 1;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .badge-in_plan {
      background-color: #fff3cd;
      color: #856404;
    }

    .badge-enrolled {
      background-color: #e6f4ff;
      color: #0b6fbf;
    }

    .badge-approved {
      background-color: #d4edda;
      color: #155724;
    }

    .badge-archived {
      background-color: #e2e3e5;
      color: #383d41;
    }

    .course-card-body {
      padding: 15px;
      flex: 1;
    }

    .description {
      color: #666;
      font-size: 14px;
      margin: 0 0 15px 0;
      /* Limit height and allow vertical scrolling for long descriptions */
      max-height: 120px;
      overflow-y: auto;
      overflow-x: hidden;
      /* Preserve line breaks and wrap long words */
      white-space: pre-wrap;
      word-break: break-word;
      -webkit-overflow-scrolling: touch;
    }

    .course-meta {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
      font-size: 13px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-item .label {
      color: #999;
      font-weight: 600;
    }

    .meta-item .value {
      color: #333;
      font-weight: 500;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background-color: #eee;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress {
      height: 100%;
      background-color: #667eea;
      transition: width 0.3s ease;
    }

    .course-card-footer {
      padding: 15px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 10px;
    }

    .btn-small {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      background: white;
      color: #333;
      border-radius: 4px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-small:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .btn-small.primary {
      background-color: #667eea;
      color: white;
      border-color: #667eea;
    }

    .btn-small.primary:hover {
      background-color: #5568d3;
      border-color: #5568d3;
    }

    .btn-small:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class CourseListComponent implements OnInit {
  @Input() courses: Course[] = [];
  @Input() emptyMessage = 'No courses available';
  @Input() showActionButton = false;
  @Input() actionButtonText: { [key: string]: string } = {};
  @Input() enrolledCourseIds: number[] = [];
  @Input() hideActionIfEnrolled = false;
  @Input() showStatusBadge = true;
  @Output() action = new EventEmitter<Course>();
  // If parent doesn't provide enrolledCourseIds, fetch them for the current user (student)
  constructor(private enrollmentService: EnrollmentService, private authService: AuthService) {}

  ngOnInit(): void {
    // If parent hasn't provided enrolledCourseIds and the current user is a student, try to load them
    const user = this.authService.getCurrentUser();
    const isStudent = user?.role === 'STUDENT';
    if ((!this.enrolledCourseIds || this.enrolledCourseIds.length === 0) && isStudent) {
      this.enrollmentService.getStudentCourses().subscribe({
        next: (courses) => {
          if (!this.enrolledCourseIds || this.enrolledCourseIds.length === 0) {
            this.enrolledCourseIds = courses.map(c => c.id);
          }
        },
        error: () => {
          if (!this.enrolledCourseIds) this.enrolledCourseIds = [];
        }
      });
    }
  }

  onAction(course: Course): void {
    this.action.emit(course);
  }

  getActionButtonText(course: Course): string {
    return this.actionButtonText[course.id] || 'Action';
  }

  isActionDisabled(course: Course): boolean {
    const text = (this.actionButtonText[course.id] || '').toLowerCase();
    // If action explicitly marked as Full, disable
    if (text === 'full') return true;
    // If the action is Join, disable when course is full
    if (text === 'join' && course.currentEnrollment >= course.maxStudents) return true;
    // For other actions (e.g. Leave) do not disable based on capacity
    return false;
  }
}
