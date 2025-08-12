import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { Router, UrlTree } from '@angular/router';
import { Observable, filter, map, take } from 'rxjs';
import { User } from '../../api/models/class/user';
import { UserService } from '../../api/services/user.service';
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
      filter(isAdmin => isAdmin !== null), // attend que Firebase ait répondu
      take(1),
      map(isAdmin => {
        console.log('AuthAdminGuardService: isAdmin', isAdmin);
        return isAdmin ? true : this.router.createUrlTree(['/signin']);
      })
    );
  }
}
