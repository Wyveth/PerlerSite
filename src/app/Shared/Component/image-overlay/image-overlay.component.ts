import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, input } from '@angular/core';
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
export class ImageOverlayComponent implements OnInit {
  @Input() title!: string;
  @Input() imageUrl!: string | string[] | null;
  @Input() background!: string;
  @Input() buttons: OverlayButton[] = [];
  @Input() active = false;

  url!: string;

  @Output() toggleRequested = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.imageUrl != null)
      this.url = Array.isArray(this.imageUrl) ? this.imageUrl[0] : this.imageUrl;
    else this.url = '';
  }
}
