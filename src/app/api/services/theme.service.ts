import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeKey = 'theme'; // localStorage key
  private currentTheme: 'light' | 'dark' | 'auto' = 'auto';

  constructor() {
    const saved = localStorage.getItem(this.themeKey) as 'light' | 'dark' | 'auto' | null;
    this.setTheme(saved || 'auto', false);

    // Si en auto, écouter changements système
    if (this.currentTheme === 'auto') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        this.applyTheme('auto');
      });
    }
  }

  setTheme(theme: 'light' | 'dark' | 'auto', persist = true) {
    this.currentTheme = theme;
    if (persist) localStorage.setItem(this.themeKey, theme);
    this.applyTheme(theme);
  }

  getTheme() {
    return this.currentTheme;
  }

  private applyTheme(theme: 'light' | 'dark' | 'auto') {
    const html = document.documentElement;
    if (theme === 'light') {
      html.classList.remove('dark');
    } else if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }
}
