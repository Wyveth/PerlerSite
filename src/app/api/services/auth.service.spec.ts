import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { provideFirebaseTesting } from 'src/testing/test-providers';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...provideFirebaseTesting()]
    });
  });

  it('should be created and report a signed-out visitor', async () => {
    const service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();

    // On attend la première émission de Firebase Auth avant la fin du test
    await TestBed.inject(Auth).authStateReady();
    await new Promise(resolve => setTimeout(resolve));

    let isAuth: boolean | null = null;
    service.isAuth$.subscribe(v => (isAuth = v)).unsubscribe();
    expect(isAuth).toBeFalse();
  });
});
