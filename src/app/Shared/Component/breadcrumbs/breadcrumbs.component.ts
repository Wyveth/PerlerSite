import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BaseComponent } from '../base/base.component';
import { AppResource } from '../../models/app.resource';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, RouterModule]
})
export class BreadcrumbsComponent extends BaseComponent implements OnChanges {
  items: MenuItem[] | undefined = [];

  @Input() nodeParent = '';
  @Input() nodeParentUrl = '';
  @Input() nodeChild = '';
  @Input() nodeChildUrl = '';
  @Input() nodeChildChild = '';
  @Input() nodeChildChildUrl = '';

  constructor(resources: AppResource) {
    super(resources);
  }

  ngOnChanges(): void {
    this.buildItems();
  }

  private buildItems() {
    this.items = [];

    if (this.nodeParent) {
      this.items.push({
        label: this.nodeParent,
        routerLink: this.nodeParentUrl != '' ? this.resource.router.base + this.nodeParentUrl : ''
      });
    }

    if (this.nodeChild) {
      this.items.push({
        label: this.nodeChild,
        routerLink: this.nodeChildUrl != '' ? this.resource.router.base + this.nodeChildUrl : ''
      });
    }

    if (this.nodeChildChild) {
      this.items.push({
        label: this.nodeChildChild,
        routerLink:
          this.nodeChildChildUrl != '' ? this.resource.router.base + this.nodeChildChildUrl : ''
      });
    }
  }
}
