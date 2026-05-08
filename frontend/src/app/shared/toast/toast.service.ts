import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ToastLevel = 'info' | 'success' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  level: ToastLevel;
  duration?: number; // ms
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messages$ = new Subject<ToastMessage>();

  onMessage(): Observable<ToastMessage> {
    return this.messages$.asObservable();
  }

  show(message: string, level: ToastLevel = 'info', duration = 5000) {
    const toast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      level,
      duration,
    };
    this.messages$.next(toast);
  }

  info(message: string, duration?: number) { this.show(message, 'info', duration); }
  success(message: string, duration?: number) { this.show(message, 'success', duration); }
  warn(message: string, duration?: number) { this.show(message, 'warning', duration); }
  error(message: string, duration?: number) { this.show(message, 'error', duration); }
}

