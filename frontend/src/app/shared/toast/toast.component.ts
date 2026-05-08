import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toasts()" class="toast" [ngClass]="t.level">
        <div class="message">{{ t.message }}</div>
        <button class="close" (click)="remove(t.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container { position: fixed; top: 16px; right: 16px; z-index: 1050; display:flex; flex-direction:column; gap:8px; }
    .toast { min-width: 240px; padding: 12px 14px; border-radius: 6px; color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); position: relative; }
    .toast .close { position:absolute; right:6px; top:4px; background:transparent; border:none; color:inherit; font-size:16px; cursor:pointer; }
    .toast.info { background: #2196f3; }
    .toast.success { background: #4caf50; }
    .toast.warning { background: #ff9800; }
    .toast.error { background: #f44336; }
  `]
})
export class ToastComponent {
  toasts = signal<ToastMessage[]>([]);

  constructor(private toastService: ToastService) {
    this.toastService.onMessage().subscribe(t => this.add(t));
  }

  private add(t: ToastMessage) {
    this.toasts.set([...this.toasts(), t]);
    if (t.duration && t.duration > 0) {
      setTimeout(() => this.remove(t.id), t.duration);
    }
  }

  remove(id: string) {
    this.toasts.set(this.toasts().filter(t => t.id !== id));
  }
}

