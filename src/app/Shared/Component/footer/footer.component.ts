import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppResource } from '../../Models/app.resource';
import { BaseComponent } from '../base/base.component';
import { scrollViewFragment } from '../header/header.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class FooterComponent extends BaseComponent {
  readonly year = new Date().getFullYear();

  constructor(
    resources: AppResource,
    private router: Router
  ) {
    super(resources);
  }

  goTo(fragment: string) {
    scrollViewFragment(this.router, fragment);
  }
}
