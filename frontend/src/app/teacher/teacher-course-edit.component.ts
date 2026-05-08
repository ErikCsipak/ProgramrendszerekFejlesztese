import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../courses/course.service';

@Component({
  selector: 'app-teacher-course-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
  <div class="edit-container">
    <div *ngIf="loading" class="loading">Loading course...</div>

    <div *ngIf="!loading && course">
      <h2>Edit Course: {{ course.name }}</h2>

      <div *ngIf="course.status !== 'IN_PLAN'" class="alert alert-error">
        Only courses in IN_PLAN state can be edited.
      </div>

      <div *ngIf="course.status === 'IN_PLAN'" class="edit-form card">
        <div class="form-group">
          <label>Name</label>
          <input [(ngModel)]="course.name" />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea rows="4" [(ngModel)]="course.description"></textarea>
        </div>
        <div class="form-group">
          <label>Max Students</label>
          <input type="number" [(ngModel)]="course.maxStudents" min="1" />
        </div>

        <div class="form-actions">
          <button class="btn-primary" (click)="save()" [disabled]="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
          <button class="btn-secondary" (click)="cancel()">Cancel</button>
        </div>

        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
      </div>
    </div>

    <div *ngIf="!loading && !course" class="alert alert-error">Course not found</div>
  </div>
  `,
  styles: [
    `
    .edit-container { padding: 20px; max-width: 900px; margin: 0 auto }
    .form-group { margin-bottom: 15px }
    input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px }
    .form-actions { display: flex; gap: 10px }
    .btn-primary { padding: 8px 12px; background: #667eea; color: #fff; border: none; border-radius: 4px }
    .btn-secondary { padding: 8px 12px; background: #6c757d; color: #fff; border: none; border-radius: 4px }
    .alert-error { margin-top: 15px; padding: 10px; background: #f8d7da; color: #721c24; border-radius: 4px }
    .loading { padding: 20px }
    `
  ]
})
export class TeacherCourseEditComponent implements OnInit {
  course: any = null;
  loading = true;
  saving = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.loading = false;
      return;
    }
    this.courseService.getCourseById(id).subscribe({
      next: (c) => { this.course = c; this.loading = false; },
      error: () => { this.error = 'Failed to load course'; this.loading = false; }
    });
  }

  save(): void {
    if (!this.course) return;
    this.saving = true;
    this.error = '';
    const payload: any = {
      name: this.course.name,
      description: this.course.description,
      maxStudents: this.course.maxStudents
    };
    this.courseService.updateCourse(this.course.id, payload).subscribe({
      next: () => { this.saving = false; this.router.navigate(['/teacher']); },
      error: (err) => { this.saving = false; this.error = err.error?.message || 'Failed to save'; }
    });
  }

  cancel(): void {
    this.router.navigate(['/teacher']);
  }
}

