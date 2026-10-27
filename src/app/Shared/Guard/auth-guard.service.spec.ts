import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/api/services/auth.service';
import { provideTestBase } from 'src/testing/test-providers';
import { AuthGuardService } from './auth-guard.service';

describe('AuthGuardService', () => {
  const isAuth$ = new BehaviorSubject<boolean | null>(null);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideTestBase(), { provide: AuthService, useValue: { isAuth$ } }]
    });
  });

  it('should allow a signed-in user', async () => {
    isAuth$.next(true);
    const result = await firstValueFrom(TestBed.inject(AuthGuardService).canActivate());
    expect(result).toBeTrue();
  });

  it('should redirect a visitor to the sign-in page', async () => {
    isAuth$.next(false);
    const result = await firstValueFrom(TestBed.inject(AuthGuardService).canActivate());
    expect(result instanceof UrlTree).toBeTrue();
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/auth/signin');
  });
});
