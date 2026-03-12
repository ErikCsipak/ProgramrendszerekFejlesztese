import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard, studentGuard, teacherGuard } from './shared/guards/role.guard';

import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { StudentDashboardComponent } from './student/student-dashboard.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { CourseDetailComponent } from './courses/course-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/student', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'student',
    component: StudentDashboardComponent,
    canActivate: [authGuard, studentGuard]
  },

  {
    path: 'teacher',
    component: TeacherDashboardComponent,
    canActivate: [authGuard, teacherGuard]
  },

  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, adminGuard]
  },

  {
    path: 'courses/:id',
    component: CourseDetailComponent,
    canActivate: [authGuard]
  },

  // Catch all
  { path: '**', redirectTo: '/student' }
];
