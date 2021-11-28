import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../Models/User.Model';
import { UserService } from '../Services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuardService implements CanActivate {
  user!: User;

  constructor(private router: Router, private userService: UserService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
      (resolve, reject) => {
        onAuthStateChanged(getAuth(),
          (user) => {
            if(user) {
              console.log('Auth Admin: ' + user.email);
              this.userService.getUserByEmail(user.email).then(
                (user: any) => {
                  this.user = user as User;

                  if(this.user.admin === true 
                    && this.user.disabled === false){
                    resolve(true);
                  }
                  else{
                    this.router.navigate(['/auth', 'signin']);
                    resolve(false);
                  }
              });
            } else {
              this.router.navigate(['/auth', 'signin']);
              resolve(false);
            }
          }
        );
      }
    );
  }
}
