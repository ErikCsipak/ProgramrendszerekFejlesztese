import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Course } from '../shared/models/course.model';
import { User } from '../shared/models/user.model';
import { CourseService } from '../courses/course.service';
import { AdminService } from '../admin/admin.service';
import { CourseListComponent } from '../courses/course-list.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CourseListComponent],
  template: `
    <div class="admin-dashboard">
      <div class="header">
        <h1>Admin Dashboard</h1>
        <p>Manage courses and users</p>
      </div>

      <!-- Tabs for Admin Functions -->
      <div class="tabs">
        <button
          *ngFor="let tab of ['courses', 'users']"
          [class.active]="activeTab === tab"
          (click)="activeTab = tab"
          class="tab-btn"
        >
          {{ tab === 'courses' ? 'Pending Courses' : 'Users' }}
        </button>
      </div>

      <!-- Pending Courses Tab -->
      <div *ngIf="activeTab === 'courses'" class="tab-content card">
        <h2>Pending Course Approvals</h2>

        <div *ngIf="loadingCourses" class="loading">Loading pending courses...</div>
        <div *ngIf="!loadingCourses && errorCourses" class="alert alert-error">
          {{ errorCourses }}
        </div>

        <div *ngIf="!loadingCourses && pendingCourses.length === 0" class="no-data">
          No pending courses
        </div>

        <div *ngIf="!loadingCourses && pendingCourses.length > 0" class="courses-table">
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Teacher</th>
                <th>Max Students</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let course of pendingCourses">
                <td><strong>{{ course.name }}</strong></td>
                <td>{{ getTeacherName(course.teacherId) }}</td>
                <td>{{ course.maxStudents }}</td>
                <td>{{ course.createdAt | date: 'short' }}</td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="btn-approve"
                      (click)="approveCourse(course.id)"
                      [disabled]="approvingCourseId === course.id"
                    >
                      {{ approvingCourseId === course.id ? 'Approving...' : 'Approve' }}
                    </button>
                    <button
                      class="btn-reject"
                      (click)="rejectCourse(course.id)"
                      [disabled]="rejectingCourseId === course.id"
                    >
                      {{ rejectingCourseId === course.id ? 'Rejecting...' : 'Reject' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Users Tab -->
      <div *ngIf="activeTab === 'users'" class="tab-content card">
        <div class="users-header">
          <h2>User Management</h2>
          <button class="btn-primary" (click)="toggleNewUserForm()">
            {{ showNewUserForm ? 'Cancel' : 'Create User' }}
          </button>
        </div>

        <!-- Create User Form -->
        <div *ngIf="showNewUserForm" class="new-user-form">
          <div class="form-title">Create New User</div>

          <div class="form-group">
            <label for="userEmail">Email</label>
            <input
              type="email"
              id="userEmail"
              [(ngModel)]="newUser.email"
              placeholder="Enter email"
            />
          </div>

          <div class="form-group">
            <label for="userFullName">Full Name</label>
            <input
              type="text"
              id="userFullName"
              [(ngModel)]="newUser.fullName"
              placeholder="Enter full name"
            />
          </div>

          <div class="form-group">
            <label for="userPassword">Password</label>
            <input
              type="password"
              id="userPassword"
              [(ngModel)]="newUser.password"
              placeholder="Enter password"
            />
          </div>

          <div class="form-group">
            <label for="userRole">Role</label>
            <select id="userRole" [(ngModel)]="newUser.role">
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>

          <div class="form-actions">
            <button class="btn-primary" (click)="createUser()" [disabled]="creatingUser">
              {{ creatingUser ? 'Creating...' : 'Create User' }}
            </button>
            <button class="btn-secondary" (click)="toggleNewUserForm()">Cancel</button>
          </div>

          <div *ngIf="userFormError" class="alert alert-error">
            {{ userFormError }}
          </div>
        </div>

        <!-- Users List -->
        <div *ngIf="loadingUsers" class="loading">Loading users...</div>
        <div *ngIf="!loadingUsers && errorUsers" class="alert alert-error">
          {{ errorUsers }}
        </div>

        <div *ngIf="!loadingUsers && users.length > 0" class="users-table">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.email }}</td>
                <td>{{ user.fullName }}</td>
                <td><span class="badge" [ngClass]="'badge-' + user.role.toLowerCase()">{{ user.role }}</span></td>
                <td>{{ user.active ? 'Active' : 'Inactive' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
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
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .tab-content h2 {
      margin: 0 0 20px 0;
      color: #333;
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

    .users-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .users-header h2 {
      margin: 0;
      flex: 1;
    }

    .new-user-form {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid #eee;
    }

    .form-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
      color: #333;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .btn-secondary {
      padding: 10px 15px;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      flex: 1;
    }

    .courses-table,
    .users-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    thead {
      background-color: #f8f9fa;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      font-weight: 600;
      color: #333;
    }

    tbody tr:hover {
      background-color: #f9f9f9;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-approve,
    .btn-reject {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-approve {
      background-color: #28a745;
      color: white;
    }

    .btn-approve:hover:not(:disabled) {
      background-color: #218838;
    }

    .btn-reject {
      background-color: #dc3545;
      color: white;
    }

    .btn-reject:hover:not(:disabled) {
      background-color: #c82333;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-admin {
      background-color: #cce5ff;
      color: #004085;
    }

    .badge-teacher {
      background-color: #fff3cd;
      color: #856404;
    }

    .badge-student {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .loading,
    .no-data {
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
export class AdminDashboardComponent implements OnInit {
  activeTab = 'courses';
  pendingCourses: Course[] = [];
  users: User[] = [];
  loadingCourses = false;
  loadingUsers = false;
  errorCourses = '';
  errorUsers = '';
  successMessage = '';
  showNewUserForm = false;
  creatingUser = false;
  userFormError = '';
  approvingCourseId: number | null = null;
  rejectingCourseId: number | null = null;

  newUser = {
    email: '',
    fullName: '',
    password: '',
    role: ''
  };

  constructor(
    private courseService: CourseService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadPendingCourses();
    this.loadUsers();
  }

  private loadPendingCourses(): void {
    this.loadingCourses = true;
    this.errorCourses = '';
    this.courseService.getPendingCourses().subscribe({
      next: (courses) => {
        this.pendingCourses = courses;
        this.loadingCourses = false;
      },
      error: (error) => {
        this.errorCourses = 'Failed to load pending courses';
        this.loadingCourses = false;
      }
    });
  }

  private loadUsers(): void {
    this.loadingUsers = true;
    this.errorUsers = '';
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loadingUsers = false;
      },
      error: (error) => {
        this.errorUsers = 'Failed to load users';
        this.loadingUsers = false;
      }
    });
  }

  approveCourse(courseId: number): void {
    this.approvingCourseId = courseId;
    this.courseService.approveCourse(courseId).subscribe({
      next: () => {
        this.successMessage = 'Course approved successfully';
        this.loadPendingCourses();
        this.approvingCourseId = null;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        alert(error.error?.message || 'Failed to approve course');
        this.approvingCourseId = null;
      }
    });
  }

  rejectCourse(courseId: number): void {
    if (confirm('Are you sure you want to reject this course?')) {
      this.rejectingCourseId = courseId;
      this.courseService.rejectCourse(courseId).subscribe({
        next: () => {
          this.successMessage = 'Course rejected successfully';
          this.loadPendingCourses();
          this.rejectingCourseId = null;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          alert(error.error?.message || 'Failed to reject course');
          this.rejectingCourseId = null;
        }
      });
    }
  }

  toggleNewUserForm(): void {
    this.showNewUserForm = !this.showNewUserForm;
    if (!this.showNewUserForm) {
      this.resetUserForm();
    }
  }

  createUser(): void {
    if (!this.newUser.email || !this.newUser.fullName || !this.newUser.password || !this.newUser.role) {
      this.userFormError = 'All fields are required';
      return;
    }

    this.creatingUser = true;
    this.userFormError = '';

    this.adminService.createUser(this.newUser).subscribe({
      next: () => {
        this.successMessage = 'User created successfully';
        this.creatingUser = false;
        this.resetUserForm();
        this.toggleNewUserForm();
        this.loadUsers();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.userFormError = error.error?.message || 'Failed to create user';
        this.creatingUser = false;
      }
    });
  }

  getTeacherName(teacherId: number): string {
    const user = this.users.find(u => u.id === teacherId);
    return user ? user.fullName : 'Unknown';
  }

  private resetUserForm(): void {
    this.newUser = {
      email: '',
      fullName: '',
      password: '',
      role: ''
    };
    this.userFormError = '';
  }
}
