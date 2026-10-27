import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/api/services/auth.service';
import { provideTestBase } from 'src/testing/test-providers';
import { AuthAdminGuardService } from './authAdmin-guard.service';

describe('AuthAdminGuardService', () => {
  const isAdmin$ = new BehaviorSubject<boolean | null>(null);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideTestBase(), { provide: AuthService, useValue: { isAdmin$ } }]
    });
  });

  it('should allow an admin', async () => {
    isAdmin$.next(true);
    const result = await firstValueFrom(TestBed.inject(AuthAdminGuardService).canActivate());
    expect(result).toBeTrue();
  });

  it('should redirect a non-admin to the sign-in page', async () => {
    isAdmin$.next(false);
    const result = await firstValueFrom(TestBed.inject(AuthAdminGuardService).canActivate());
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/auth/signin');
  });
});
