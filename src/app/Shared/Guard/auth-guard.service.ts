import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { Observable } from 'rxjs';
import { User } from '../../api/models/class/user';
import { UserService } from '../../api/services/user.service';

@Injectable()
export class AuthGuardService {
  user!: User;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(getAuth(), user => {
        if (user) {
          this.userService.getUserByEmail(user.email).then((user: any) => {
            this.user = user as User;

            if (this.user.disabled === false) {
              resolve(true);
            } else {
              this.router.navigate(['/auth', 'signin']);
              resolve(false);
            }
          });
        } else {
          this.router.navigate(['/auth', 'signin']);
          resolve(false);
        }
      });
    });
  }
}
