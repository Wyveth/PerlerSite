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
  options: Theme[] = ['light', 'dark', 'auto'];
  icons: Record<Theme, string> = {
    light: '☀️',
    dark: '🌙',
    auto: '🖥️'
  };

  current: Theme;

  constructor(private themeService: ThemeService) {
    this.current = this.themeService.getTheme();
  }

  /** Passe à l’option suivante avec animation */
  nextTheme() {
    const currentIndex = this.options.indexOf(this.current);
    const nextIndex = (currentIndex + 1) % this.options.length;
    this.current = this.options[nextIndex];
    this.themeService.setTheme(this.current);
  }
}
