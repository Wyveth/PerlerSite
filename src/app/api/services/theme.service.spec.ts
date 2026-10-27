import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.removeItem('theme');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.removeItem('theme');
    document.documentElement.classList.remove('dark');
  });

  it('should add the dark class in dark mode and remove it in light mode', () => {
    service.setTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('dark');

    service.setTheme('light');
    expect(document.documentElement.classList.contains('dark')).toBeFalse();
    expect(service.getTheme()).toBe('light');
  });
});
