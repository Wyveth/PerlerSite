import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from 'src/app/api/services/theme.service';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  standalone: true,
  imports: [CommonModule, ButtonModule]
})
export class ThemeSwitchComponent {
  options: { label: string; value: 'light' | 'dark' | 'auto' }[] = [
    { label: '☀️', value: 'light' },
    { label: '🌙', value: 'dark' },
    { label: '🖥️', value: 'auto' }
  ];

  current: 'light' | 'dark' | 'auto';

  constructor(private themeService: ThemeService) {
    this.current = this.themeService.getTheme();
  }

  setTheme(value: 'light' | 'dark' | 'auto') {
    this.current = value;
    this.themeService.setTheme(value);
  }
}
