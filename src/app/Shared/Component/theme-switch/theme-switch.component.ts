import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Theme, ThemeService } from 'src/app/api/services/theme.service';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  standalone: true,
  imports: [CommonModule, ButtonModule]
})
export class ThemeSwitchComponent {
  options: { icon: string; value: Theme }[] = [
    { icon: '☀️', value: 'light' },
    { icon: '🌙', value: 'dark' },
    { icon: '🖥️', value: 'auto' }
  ];

  current: Theme;

  constructor(private themeService: ThemeService) {
    this.current = this.themeService.getTheme();
  }

  setTheme(theme: Theme) {
    this.current = theme;
    this.themeService.setTheme(theme);
  }
}
