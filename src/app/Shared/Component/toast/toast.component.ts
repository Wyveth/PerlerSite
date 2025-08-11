import { Component, TemplateRef } from '@angular/core';
import { ToastService } from '../../../api/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toasts',
  template: `
    <!-- <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [header]="toast.headertext"
      [class]="toast.classname"
      [autohide]="toast.autohide"
      [delay]="toast.delay || 5000"
      (hide)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast> -->
  `,
  host: { '[class.ngb-toasts]': 'true' },
  standalone: true,
  imports: [CommonModule],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  isTemplate(toast: { textOrTpl: any }) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
