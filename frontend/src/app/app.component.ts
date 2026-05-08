import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast/toast.component';
import { TopNavbarComponent } from './shared/top-navbar.component';
import { AuthService } from './auth/auth.service';

@Component({
    selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, ToastComponent, TopNavbarComponent],
    template: `
    <app-top-navbar></app-top-navbar>
    <div class="container" [style.marginTop.px]="authService.isAuthenticated() ? 64 : 0">
      <router-outlet></router-outlet>
    </div>
    <app-toast></app-toast>
  `,
    styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      /* push content below the fixed top navbar */
      margin-top: 64px;
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
