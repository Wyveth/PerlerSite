import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, filter, map, take } from 'rxjs';
import { User } from '../../api/models/class/user';
import { AuthService } from 'src/app/api/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuardService {
  user!: User;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAdmin$.pipe(
      filter(isAdmin => isAdmin !== null),
      take(1),
      map(isAdmin => {
        return isAdmin ? true : this.router.createUrlTree(['/signin']);
      })
    );
  }
}
