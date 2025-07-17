import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from '../../Services/auth.service';
import * as AOS from 'aos';
import { UserService } from '../../Services/user.service';
import { User } from '../../Models/User.Model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit {
  isAuth: boolean = false;
  isAuthA: boolean = false;
  user!: User;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        this.userService.getUserByEmail(user.email).then(
          (user: any) => {
            this.user = user as User;
            if(this.user.admin === true){
              this.isAuthA = true;
            }
            else{
              this.isAuthA = false;
            }
          });
        this.isAuth = true;
      } else {
        this.isAuth = false;
      }
    }
    );
  }

  onProfil(key: string){
    this.router.navigate(['/profil', key]);
  }

  onSignOut() {
    this.authService.signOutUser();
  }
}
