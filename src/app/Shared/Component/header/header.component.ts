import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/api/services/auth.service';
import { User } from 'src/app/api/models/class/user';
import { AppResource } from 'src/app/shared/models/app.resource';
import { BaseComponent } from '../base/base.component';
import { DrawerModule } from 'primeng/drawer';
import { combineLatest, filter } from 'rxjs';
import { severity } from '../../enum/severity';
import { ThemeSwitchComponent } from '../theme-switch/theme-switch.component';

interface NavLink {
  label: string;
  fragment: string;
}

interface AccountLink {
  label: string;
  routerLink?: string;
  action?: () => void;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, DrawerModule, ThemeSwitchComponent]
})
export class HeaderComponent extends BaseComponent implements OnInit {
  isAuth = false;
  isAdmin = false;
  user!: User | null;

  /** Menu mobile (drawer) */
  visibleSidebar = false;
  /** Menu déroulant du compte (desktop) */
  isDropdownOpen = false;

  navLinks: NavLink[] = [];
  accountLinks: AccountLink[] = [];
  adminLinks: AccountLink[] = [];

  constructor(
    resources: AppResource,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private host: ElementRef<HTMLElement>
  ) {
    super(resources);
  }

  ngOnInit() {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      mirror: false
    });

    const routes = this.resource.router.routes;
    const menu = this.resource.layout.header.menu;
    this.navLinks = [
      { label: menu.achievements, fragment: routes.achievements },
      { label: this.resource.home.menu_sizes, fragment: 'atelier' },
      { label: menu.faq, fragment: routes.faq },
      { label: menu.contact, fragment: routes.contact }
    ];

    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });

    combineLatest([
      this.authService.isAuth$.pipe(filter((v): v is boolean => v !== null)),
      this.authService.isAdmin$.pipe(filter((v): v is boolean => v !== null))
    ]).subscribe(([isAuth, isAdmin]) => {
      this.isAuth = isAuth;
      this.isAdmin = isAdmin;
      this.updateAccountLinks();
    });
  }

  /** Ferme le menu du compte lors d'un clic en dehors */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isDropdownOpen && !this.host.nativeElement.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  goTo(fragment: string) {
    this.visibleSidebar = false;
    this.isDropdownOpen = false;
    scrollViewFragment(this.router, fragment);
  }

  runAccountLink(link: AccountLink) {
    this.visibleSidebar = false;
    this.isDropdownOpen = false;
    if (link.action) {
      link.action();
    } else if (link.routerLink) {
      this.router.navigate([link.routerLink]);
    }
  }

  onProfil(key: string) {
    this.router.navigate([this.resource.router.routes.profile, key]);
  }

  onSignOut() {
    this.authService.logout().then(() => {
      this.messageService.add({
        severity: severity.success,
        summary: this.resource.layout.header.signout_success_summary,
        detail: this.resource.layout.header.signout_success_detail
      });
      this.updateAccountLinks();
      this.router.navigate([this.resource.router.routes.home]);
    });
  }

  private updateAccountLinks() {
    const menu = this.resource.layout.header.menu;
    const routes = this.resource.router.routes;

    this.accountLinks = this.isAuth
      ? [{ label: menu.profile, action: () => this.onProfil(this.user?.key ?? '') }]
      : [];

    this.adminLinks =
      this.isAuth && this.isAdmin
        ? [
            { label: menu.products, routerLink: routes.products },
            { label: menu.tags, routerLink: routes.tags },
            { label: menu.perlertypes, routerLink: routes.perlertypes },
            { label: menu.contacts, routerLink: routes.contacts },
            { label: menu.users, routerLink: routes.users }
          ]
        : [];
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
    AOS.refresh();
  };

  if (currentUrl !== '/') {
    router.navigateByUrl('/').then(() => {
      setTimeout(scrollAndRefreshAOS, 100);
    });
  } else {
    setTimeout(scrollAndRefreshAOS, 50);
  }
}
