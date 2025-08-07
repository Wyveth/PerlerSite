import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    standalone: true,
    imports: [CommonModule, BreadcrumbModule, RouterModule]
})
export class BreadcrumbsComponent implements OnInit {
  items: MenuItem[] | undefined = [];
  home: MenuItem | undefined;

  @Input() nodeParent = "";
  @Input() nodeParentUrl = "";
  @Input() nodeChild = "";
  @Input() nodeChildUrl = "";
  @Input() nodeChildChild = "";
  @Input() nodeChildChildUrl = "";
  
  constructor() { }

  ngOnInit() {
    this.items = this.items || []; // Assurez-vous que items n'est pas undefined
    this.items.push({
      label: this.nodeParent,
      routerLink: '/' + this.nodeParentUrl
    });

    if (this.nodeChild) {
      this.items.push({
        label: this.nodeChild,
        routerLink: this.nodeChildUrl
      });
    }

    if (this.nodeChildChild) {
      this.items.push({
        label: this.nodeChildChild,
        routerLink: this.nodeChildChildUrl
      });
    }
  }
}
