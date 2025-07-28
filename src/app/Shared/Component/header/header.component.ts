import { MenubarModule } from 'primeng/menubar';
import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import * as AOS from 'aos';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/api/services/auth.service';
import { UserService } from 'src/app/api/services/user.service';
import { User } from 'src/app/api/models/class/user';
import { AppResource } from 'src/app/shared/models/app.resource';
import { Base } from '../base/base';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule, MenubarModule]
})
export class HeaderComponent extends Base implements OnInit {
  isAuth: boolean = false;
  isAuthA: boolean = false;
  user!: User;

  mobileMenu: boolean = false;

  menuItems: MenuItem[] = [
    {
      label: 'Accueil',
      icon: 'pi pi-home',
      routerLink: ['/']
    },
    {
      label: 'Mes réalisations',
      icon: 'pi pi-images',
      routerLink: ['#portfolio']
    },
    {
      label: 'F.A.Q',
      icon: 'pi pi-question',
      routerLink: ['#faq']
    },
    {
      label: 'Contact',
      icon: 'pi pi-envelope',
      routerLink: ['#contact']
    },
    {
      label: 'Profil',
      icon: 'pi pi-user',
      visible: this.isAuth
    }
  ];

  isDropdownOpen = false;



  constructor(resources: AppResource, private authService: AuthService, private userService: UserService, private router: Router) { 
    super(resources);
  }

  ngOnInit() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    this.mobileMenu = false;    

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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onProfil(key: string){
    this.router.navigate(['/profil', key]);
  }

  onSignOut() {
    this.authService.signOutUser();
  }
}
