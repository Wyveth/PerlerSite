import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeKey = 'theme';
  private currentTheme: Theme = 'auto';

  constructor() {
    const saved = localStorage.getItem(this.themeKey) as Theme | null;
    this.setTheme(saved || 'auto', false);

    // Écoute les changements système si mode auto
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.currentTheme === 'auto') {
        this.applyTheme('auto');
      }
    });
  }

  setTheme(theme: Theme, persist = true) {
    this.currentTheme = theme;
    if (persist) localStorage.setItem(this.themeKey, theme);
    this.applyTheme(theme);
  }

  getTheme(): Theme {
    return this.currentTheme;
  }

  private applyTheme(theme: Theme) {
    const html = document.documentElement;

    if (theme === 'light') {
      html.classList.remove('dark');
    } else if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      // Auto → suivre le système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.classList.toggle('dark', prefersDark);
    }
  }
}
