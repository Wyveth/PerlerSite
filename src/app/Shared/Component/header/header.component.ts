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
import { Header } from '../../models/class/header';

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

  header: Header = {
    logo: this.resource.layout.header.logo,
    titre: this.resource.layout.header.title,
    items: [
      {
        label: this.resource.layout.header.menu.home,
        icon: 'ri-home-4-line',
        command: () => {
          scrollViewFragment(this.router, this.resource.layout.header.router.routes.welcome);
        }
      },
      {
        label: this.resource.layout.header.menu.achievements,
        command: () => {
          scrollViewFragment(this.router, this.resource.layout.header.router.routes.achievements);
        }
      },
      {
        label: this.resource.layout.header.menu.faq,
        command: () => {
          scrollViewFragment(this.router, this.resource.layout.header.router.routes.faq);
        }
      },
      {
        label: this.resource.layout.header.menu.contact,
        command: () => {
          scrollViewFragment(this.router, this.resource.layout.header.router.routes.contact);
        }
      },
      {
        icon: 'ri-account-circle-line',
        items: [
          {
            label: this.resource.layout.header.menu.signin,
            visible: !this.isAuth,
            routerLink: this.resource.layout.header.router.routes.signin
          },
          {
            visible: this.isAuth,
            label: this.resource.layout.header.menu.profil,
            command() {
              this.onProfil(this.user.key);
            }
          },
          {
            visible: this.isAuthA,
            label: this.resource.layout.header.menu.admin,
            routerLink: this.resource.layout.header.router.routes.admin,
            items: [
              {
                label: this.resource.layout.header.menu.products,
                routerLink: this.resource.layout.header.router.routes.products
              },
              {
                label: this.resource.layout.header.menu.tags,
                routerLink: this.resource.layout.header.router.routes.tags
              },
              {
                label: this.resource.layout.header.menu.perlertypes,
                routerLink: this.resource.layout.header.router.routes.perlertypes
              },
              {
                label: this.resource.layout.header.menu.contacts,
                routerLink: this.resource.layout.header.router.routes.contacts
              },
              {
                label: this.resource.layout.header.menu.users,
                routerLink: this.resource.layout.header.router.routes.users
              },
            ]
          },
          {
            visible: this.isAuth,
            label: this.resource.layout.header.menu.signout,
            command() {
              this.onSignOut();
            }
          }
        ]
      }
    ]
  }

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

  hasChildren(item: any): boolean {
    return Array.isArray(item?.items) && item.items.length > 0;
  }
}

function scrollViewFragment(router: Router, fragment: string, scrollType: 'smooth' | 'auto' = 'smooth') {
  const currentUrl = router.url.split('#')[0];
  if (currentUrl !== '/') {
    // Si on n’est pas sur la home, navigue d’abord, puis scroll après la navigation
    router.navigateByUrl('/').then(() => {
      setTimeout(() => {
        const el = document.getElementById(fragment);
        if (el) el.scrollIntoView({ behavior: scrollType });
      }, 100); // petit délai pour que la vue se charge
    });
  } else {
    // Sinon, scroll directement
    const el = document.getElementById(fragment);
    if (el) el.scrollIntoView({ behavior: scrollType });
  }
}