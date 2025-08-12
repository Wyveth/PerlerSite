import { AuthService } from 'src/app/api/services/auth.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, filter, map, take } from 'rxjs';
import { User } from '../../api/models/class/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  user!: User;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuth$.pipe(
      filter(isAuth => isAuth !== null), // attend que Firebase ait répondu
      take(1),
      map(isAuth => {
        console.log('AuthGuardService: isAuth', isAuth);
        if (isAuth) {
          return true; // Accès autorisé
        } else {
          // Redirection vers page de connexion ou d'erreur
          this.router.navigate(['/signin']);
          return false; // Accès refusé
        }
      })
    );
  }
}
