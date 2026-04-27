import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-redirect',
  standalone: true,
  template: `<div style="display:flex;align-items:center;justify-content:center;height:80vh">Redirecting...</div>`
})
export class RedirectComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      const role = user?.role ?? 'STUDENT';
      if (role === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else if (role === 'TEACHER') {
        this.router.navigate(['/teacher']);
      } else {
        this.router.navigate(['/student']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
