import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <header class="topnav" *ngIf="authService.isAuthenticated()">
    <div class="left">
      <div class="brand">CourseMgmt</div>
      <button class="hamburger" (click)="toggleMobileMenu()" aria-label="Toggle menu">☰</button>
      <nav class="mobile-menu" [class.open]="mobileMenuOpen">
        <ul>
          <li><a routerLink="/">Home</a></li>
        </ul>
      </nav>
      <div class="breadcrumbs" *ngIf="breadcrumbs.length > 0">
        <ng-container *ngFor="let b of breadcrumbs; let i = index">
          <ng-container *ngIf="b.isClickable; else nonClickable">
            <a class="crumb" (click)="navigateTo(b.url)">{{ b.label }}</a>
          </ng-container>
          <ng-template #nonClickable>
            <span class="crumb-text">{{ b.label }}</span>
          </ng-template>
          <span *ngIf="i < (breadcrumbs.length - 1)" class="sep">/</span>
        </ng-container>
      </div>
    </div>

    <div class="right" *ngIf="(authService.currentUser$ | async) as user">
      <div class="user-badge">
        <div class="avatar">{{ getInitials(user) }}</div>
        <div class="name">{{ user.fullName || user.email }}</div>
      </div>
      <button class="logout" (click)="onLogout()">Logout</button>
    </div>
  </header>
  `,
  styles: [
    `
    .topnav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      background: #ffffff;
      border-bottom: 1px solid #eee;
      z-index: 1100;
    }

    .left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .brand {
      font-weight: 700;
      font-size: 18px;
      white-space: nowrap;
    }

    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
      margin-left: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .crumb {
      cursor: pointer;
      color: inherit;
      text-decoration: none;
    }

    .sep { color: #ccc }

    .right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-badge { display: flex; align-items: center; gap: 8px }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #667eea;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .name { font-size: 14px; color: #333; font-weight: 600 }

    .logout {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
    }

    /* Mobile: hide breadcrumbs and show hamburger */
    .hamburger { display: none; background: transparent; border: none; font-size: 22px; cursor: pointer }
    .mobile-menu { display: none }

    @media (max-width: 767px) {
      .breadcrumbs { display: none }
      .hamburger { display: inline-block }
      .mobile-menu {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        background: #fff;
        border-bottom: 1px solid #eee;
        display: none;
        z-index: 1100;
      }
      .mobile-menu.open { display: block }
      .mobile-menu ul { list-style: none; margin: 0; padding: 8px 0 }
      .mobile-menu li { padding: 8px 16px }
      .mobile-menu a { color: #333; text-decoration: none }
    }
    `
  ]
})
export class TopNavbarComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  breadcrumbs: Array<{ label: string; url: string; isParam?: boolean; isClickable?: boolean }> = [];
  private sub?: Subscription;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.buildBreadcrumbs(this.router.url);
    this.sub = this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        this.buildBreadcrumbs(evt.urlAfterRedirects || evt.url);
        this.mobileMenuOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }

  buildBreadcrumbs(url: string): void {
    // build breadcrumbs from URL segments
    const map: { [k: string]: string } = {
      '': 'Home',
      'courses': 'Courses',
      'student': 'Student',
      'teacher': 'Teacher'
    };
    const parts = url.split('?')[0].split('#')[0].split('/').filter(p => p.length > 0);
    const crumbs: Array<{ label: string; url: string; isParam?: boolean; isClickable?: boolean }> = [];
    let acc = '';
    // always include Home
    crumbs.push({ label: 'Home', url: '/', isClickable: true });
    const availablePaths = this.router.config.map(r => r.path || '');
    parts.forEach((p) => {
      acc += '/' + p;
      const isParam = /^\d+$/.test(p);
      const label = map[p] || (isParam ? 'Details' : decodeURIComponent(p));
      const pathKey = acc.replace(/^\//, '');
      // clickable only when not a numeric param and matches a top-level route path
      const isClickable = !isParam && availablePaths.indexOf(pathKey) !== -1;
      crumbs.push({ label, url: acc, isParam, isClickable });
    });
    // if only home, keep single crumb
    this.breadcrumbs = crumbs.length > 0 ? crumbs : [{ label: 'Home', url: '/' }];
  }

  onLogout(): void {
    this.authService.logoutRequest().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => { this.authService.logout(); this.router.navigate(['/login']); }
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


