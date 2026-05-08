import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast/toast.component';
import { SideNavbarComponent } from './shared/side-navbar.component';
import { AuthService } from './auth/auth.service';

@Component({
    selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, ToastComponent, SideNavbarComponent],
    template: `
    <app-side-navbar (collapsedChange)="onSidebarCollapsed($event)"></app-side-navbar>
    <div class="container" [style.margin-left.px]="authService.isAuthenticated() && !sidebarCollapsed ? 240 : 0">
      <router-outlet></router-outlet>
    </div>
    <app-toast></app-toast>
  `,
    styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      /* margin-left is set dynamically so the sidebar doesn't reserve space when not visible */
    }
    @media (max-width: 767px) {
      .container { margin-left: 0 !important; }
    }
  `]
})
export class AppComponent {
  title = 'coursemgmt-frontend';
  sidebarCollapsed = false;
  constructor(public authService: AuthService) {}

  onSidebarCollapsed(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
}
