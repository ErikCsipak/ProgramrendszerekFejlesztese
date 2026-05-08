import { Component, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <nav class="sidebar" [class.collapsed]="collapsed" *ngIf="authService.isAuthenticated()">
    <div class="sidebar-header">
      <button class="toggle-btn" (click)="toggle()" aria-label="Toggle menu">☰</button>
      <div class="brand">CourseMgmt</div>
      <div class="profile" *ngIf="(authService.currentUser$ | async) as user">
        <div class="avatar">{{ getInitials(user) }}</div>
        <div class="profile-name">{{ user.fullName || user.email }}</div>
      </div>
    </div>

    <ul class="nav-list">
      <li class="nav-item"><a routerLink="/" routerLinkActive="active" class="nav-link" (click)="onItemClick()">Home</a></li>
      <li *ngIf="(authService.currentUser$ | async)?.role === 'STUDENT'" class="nav-item"><a routerLink="/courses" routerLinkActive="active" class="nav-link" (click)="onItemClick()">Courses</a></li>
      <li *ngIf="(authService.currentUser$ | async)?.role === 'TEACHER'" class="nav-item"><a routerLink="/teacher" routerLinkActive="active" class="nav-link" (click)="onItemClick()">Teacher</a></li>
      <li *ngIf="(authService.currentUser$ | async)?.role === 'STUDENT'" class="nav-item"><a routerLink="/student" routerLinkActive="active" class="nav-link" (click)="onItemClick()">Student</a></li>
    </ul>

    <div class="spacer"></div>
    <button class="logout-btn" (click)="onLogout()">Logout</button>
  </nav>
  `,
  styles: [
    `
    /* Sidebar container */
    .sidebar {
      width: 220px;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      background: #f5f7ff;
      padding: 20px;
      box-shadow: 2px 0 6px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      transform: translateX(0);
      transition: transform 0.25s ease;
      z-index: 1000;
    }

    /* Collapsed state (hidden on small screens) */
    .sidebar.collapsed {
      transform: translateX(-100%);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .toggle-btn {
      display: none;
      background: transparent;
      border: none;
      font-size: 20px;
      cursor: pointer;
    }

    .brand {
      font-weight: 700;
    }

    .profile {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: auto;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #667eea;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .profile-name {
      font-size: 14px;
      color: #333;
      font-weight: 600;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
    }

    .nav-item {
      margin-bottom: 8px;
    }

    .nav-link {
      display: block;
      padding: 8px 10px;
      color: #333;
      text-decoration: none;
      border-radius: 4px;
    }

    .nav-link:hover, .nav-link.active {
      background: #e6e9ff;
      color: #1f2d78;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .logout-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 4px;
      width: 100%;
    }

    /* Responsive tweaks */
    @media (max-width: 767px) {
      .sidebar {
        width: 80%;
        max-width: 260px;
      }
      .toggle-btn {
        display: inline-block;
      }
    }
    `
  ]
})
export class SideNavbarComponent implements OnInit {
  collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  constructor(public authService: AuthService, private router: Router) {
    // start collapsed on narrow screens
    this.collapsed = (typeof window !== 'undefined') && window.innerWidth < 768;
  }

  ngOnInit(): void {
    // emit initial state so parent can adjust layout
    this.collapsedChange.emit(this.collapsed);
  }

  @HostListener('window:resize')
  onResize() {
    // automatically collapse when viewport is small, expand on larger screens
    const newCollapsed = window.innerWidth < 768;
    if (newCollapsed !== this.collapsed) {
      this.collapsed = newCollapsed;
      this.collapsedChange.emit(this.collapsed);
    }
  }

  toggle(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  onItemClick(): void {
    // collapse the sidebar on small screens after navigation
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.collapsed = true;
      this.collapsedChange.emit(this.collapsed);
    }
  }

  onLogout(): void {
    this.authService.logoutRequest().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        // even if server call fails, clear local state and navigate
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  getInitials(user: any): string {
    if (!user) return '';
    const name = user.fullName || user.email || '';
    const parts = name.split(' ').filter((p: string) => p.length > 0);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}



