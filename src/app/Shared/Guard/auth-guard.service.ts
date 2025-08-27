import { AuthService } from 'src/app/api/services/auth.service';
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, filter, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAuth$.pipe(
      filter(isAuth => isAuth !== null),
      take(1),
      map(isAuth => {
        return isAuth ? true : this.router.createUrlTree(['/signin']);
      })
    );
  }
}
