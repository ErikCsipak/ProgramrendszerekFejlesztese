import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

const hasRole = (requiredRole: string): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.getCurrentUser();

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    if (user.role === requiredRole) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  };
};

export const studentGuard: CanActivateFn = hasRole('STUDENT');
export const teacherGuard: CanActivateFn = hasRole('TEACHER');
export const adminGuard: CanActivateFn = hasRole('ADMIN');
