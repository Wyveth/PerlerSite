import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Theme, ThemeService } from 'src/app/api/services/theme.service';
import { BaseComponent } from '../base/base.component';
import { AppResource } from '../../Models/app.resource';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class ThemeSwitchComponent extends BaseComponent {
  options: Theme[] = ['light', 'dark', 'auto'];
  current: Theme;

  constructor(
    resources: AppResource,
    private themeService: ThemeService
  ) {
    super(resources);
    this.current = this.themeService.getTheme();
  }

  get label(): string {
    const names: Record<Theme, string> = {
      light: this.resource.home.theme_light,
      dark: this.resource.home.theme_dark,
      auto: this.resource.home.theme_auto
    };
    return this.resource.home.theme.format(names[this.current]);
  }

  /** Passe à l'option suivante : clair → sombre → automatique */
  nextTheme() {
    const currentIndex = this.options.indexOf(this.current);
    this.current = this.options[(currentIndex + 1) % this.options.length];
    this.themeService.setTheme(this.current);
  }
}
