import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Course } from '../shared/models/course.model';
import { CourseService } from './course.service';

@Component({
    selector: 'app-course-detail',
    imports: [CommonModule, RouterModule],
    template: `
    <div class="course-detail-container">
      <div *ngIf="loading" class="loading">Loading course details...</div>

      <div *ngIf="!loading && course" class="card">
        <div class="card-header">
          <h2>{{ course.name }}</h2>
          <span class="badge" [ngClass]="'badge-' + course.status.toLowerCase()">
            {{ course.status }}
          </span>
        </div>

        <div class="course-info">
          <div class="info-row">
            <label>Description:</label>
            <p>{{ course.description || 'No description provided' }}</p>
          </div>

          <div class="info-row">
            <label>Max Students:</label>
            <p>{{ course.maxStudents }}</p>
          </div>

          <div class="info-row">
            <label>Current Enrollment:</label>
            <p>{{ course.currentEnrollment }} / {{ course.maxStudents }}</p>
          </div>

          <div class="progress-bar">
            <div class="progress" [style.width.%]="(course.currentEnrollment / course.maxStudents) * 100"></div>
          </div>

          <div *ngIf="course.schedules && course.schedules.length > 0" class="info-row">
            <label>Schedule:</label>
            <div class="schedules">
              <div *ngFor="let schedule of course.schedules" class="schedule-item">
                <strong>{{ schedule.dayOfWeek }}</strong> - {{ schedule.startTime }} to {{ schedule.endTime }}
                <span *ngIf="schedule.location"> @ {{ schedule.location }}</span>
              </div>
            </div>
          </div>

          <div class="info-row">
            <label>Created:</label>
            <p>{{ course.createdAt | date: 'short' }}</p>
          </div>

          <div *ngIf="course.status === 'APPROVED'" class="info-row">
            <label>Approved On:</label>
            <p>{{ course.approvedAt | date: 'short' }}</p>
          </div>
        </div>

        <ng-content></ng-content>
      </div>

      <div *ngIf="!loading && !course" class="alert alert-error">
        Course not found
      </div>
    </div>
  `,
    styles: [`
    .course-detail-container {
      padding: 20px;
    }

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .card-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h2 {
      margin: 0;
      font-size: 24px;
    }

    .badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-in_plan {
      background-color: #fff3cd;
      color: #856404;
    }

    .badge-approved {
      background-color: #d4edda;
      color: #155724;
    }

    .badge-archived {
      background-color: #e2e3e5;
      color: #383d41;
    }

    .course-info {
      padding: 20px;
    }

    .info-row {
      margin-bottom: 20px;
    }

    .info-row label {
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 8px;
    }

    .info-row p {
      color: #666;
      margin: 0;
    }

    .schedules {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .schedule-item {
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
      color: #333;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background-color: #eee;
      border-radius: 4px;
      overflow: hidden;
      margin: 10px 0;
    }

    .progress {
      height: 100%;
      background-color: #667eea;
      transition: width 0.3s ease;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  loading = true;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe({
        next: (course) => {
          this.course = course;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading course', error);
          this.loading = false;
        }
      });
    }
  }
}
