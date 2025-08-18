import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

export interface OverlayButton {
  label: string;
  icon: string;
  color: string;
  command?: (event?: Event) => void; // event optionnel pour + de souplesse
}

@Component({
  selector: 'app-image-overlay',
  imports: [CommonModule, ButtonModule],
  templateUrl: './image-overlay.component.html',
  standalone: true
})
export class ImageOverlayComponent {
  @Input() title!: string;
  @Input() imageUrl!: string;
  @Input() buttons: OverlayButton[] = [];
  @Input() active = false;

  @Output() toggleRequested = new EventEmitter<void>();
}
