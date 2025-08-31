import { MenubarModule } from 'primeng/menubar';
import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/api/services/auth.service';
import { User } from 'src/app/api/models/class/user';
import { AppResource } from 'src/app/shared/models/app.resource';
import { BaseComponent } from '../base/base.component';
import { DrawerModule } from 'primeng/drawer';
import { combineLatest, filter } from 'rxjs';
import { severity } from '../../enum/severity';
import { ThemeSwitchComponent } from '../theme-switch/theme-switch.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, DrawerModule, ThemeSwitchComponent]
})
export class HeaderComponent extends BaseComponent implements OnInit {
  isAuth: boolean = false;
  isAdmin: boolean = false;
  user!: User | null;
  visibleSidebar = false;

  menuItems: MenuItem[] = [];

  isDropdownOpen = false;

  constructor(
    resources: AppResource,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {
    super(resources);
  }

  ngOnInit() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });

    combineLatest([
      this.authService.isAuth$.pipe(filter((v): v is boolean => v !== null)),
      this.authService.isAdmin$.pipe(filter((v): v is boolean => v !== null))
    ]).subscribe(([isAuth, isAdmin]) => {
      this.isAuth = isAuth;
      this.isAdmin = isAdmin;
      this.updateMenuItems();
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onProfil(key: string) {
    this.router.navigate(['/profil', key]);
  }

  onSignOut() {
    this.authService.logout().then(() => {
      this.messageService.add({
        severity: severity.success,
        summary: this.resource.layout.header.signout_success_summary,
        detail: this.resource.layout.header.signout_success_detail
      });
      this.router.navigate(['/']);
    });
  }

  hasChildren(item: any): boolean {
    return Array.isArray(item?.items) && item.items.length > 0;
  }

  executeCommand(item: MenuItem) {
    if (item.command) {
      item.command({ originalEvent: undefined, item: item });
      this.visibleSidebar = false;
    }
  }

  updateMenuItems() {
    this.menuItems = [
      {
        label: this.resource.layout.header.menu.home,
        icon: 'ri-home-4-line',
        command: () => {
          scrollViewFragment(this.router, this.resource.router.routes.welcome);
        }
      },
      {
        label: this.resource.layout.header.menu.achievements,
        command: () => {
          scrollViewFragment(this.router, this.resource.router.routes.achievements);
        }
      },
      {
        label: this.resource.layout.header.menu.faq,
        command: () => {
          scrollViewFragment(this.router, this.resource.router.routes.faq);
        }
      },
      {
        label: this.resource.layout.header.menu.contact,
        command: () => {
          scrollViewFragment(this.router, this.resource.router.routes.contact);
        }
      },
      {
        icon: 'ri-account-circle-line',
        items: [
          {
            label: this.resource.layout.header.menu.signin,
            visible: !this.isAuth,
            routerLink: this.resource.router.routes.signin
          },
          {
            visible: this.isAuth,
            label: this.resource.layout.header.menu.profile,
            command: () => this.onProfil(this.user?.key ?? '')
          },
          {
            visible: this.isAdmin,
            label: this.resource.layout.header.menu.admin,
            items: [
              {
                label: this.resource.layout.header.menu.products,
                routerLink: this.resource.router.routes.products
              },
              {
                label: this.resource.layout.header.menu.tags,
                routerLink: this.resource.router.routes.tags
              },
              {
                label: this.resource.layout.header.menu.perlertypes,
                routerLink: this.resource.router.routes.perlertypes
              },
              {
                label: this.resource.layout.header.menu.contacts,
                routerLink: this.resource.router.routes.contacts
              },
              {
                label: this.resource.layout.header.menu.users,
                routerLink: this.resource.router.routes.users
              }
            ]
          },
          {
            visible: this.isAuth,
            label: this.resource.layout.header.menu.signout,
            command: () => this.onSignOut()
          }
        ]
      }
    ];
  }

  isAbsolute(): boolean {
    // Liste des pages où le menu doit être "absolute"
    return ['/'].includes(this.router.url);
  }
}

export function scrollViewFragment(
  router: Router,
  fragment: string,
  scrollType: 'smooth' | 'auto' = 'smooth'
) {
  const currentUrl = router.url.split('#')[0];

  const scrollAndRefreshAOS = () => {
    const el = document.getElementById(fragment);
    if (el) {
      el.scrollIntoView({ behavior: scrollType });
    }
    AOS.refresh(); // AOS est sûr car importé
  };

  if (currentUrl !== '/') {
    router.navigateByUrl('/').then(() => {
      setTimeout(scrollAndRefreshAOS, 100);
    });
  } else {
    setTimeout(scrollAndRefreshAOS, 50);
  }
}
