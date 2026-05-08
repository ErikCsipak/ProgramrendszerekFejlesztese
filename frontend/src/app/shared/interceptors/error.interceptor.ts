import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: any) => {
      // Try to extract a friendly message
      let msg = 'An unexpected error occurred';
      try {
        if (err && err.error && err.error.message) {
          msg = err.error.message;
        } else if (err && err.message) {
          msg = err.message;
        } else if (typeof err === 'string') {
          msg = err;
        }
      } catch (e) {
        // ignore
      }

      // Show toast and rethrow so callers can still handle it
      toast.error(msg);
      return throwError(() => err);
    })
  );
};

