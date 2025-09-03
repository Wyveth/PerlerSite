import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { UserFormComponent } from '../admin/user/user-form/user-form.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { OrdererListComponent } from '../orderer-list/orderer-list.component';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from 'src/app/shared/models/app.resource';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    UserFormComponent,
    ChangePasswordComponent,
    OrdererListComponent
  ]
})
export class ProfilComponent extends BaseComponent implements OnInit {
  constructor(resources: AppResource) {
    super(resources);
  }

  ngOnInit() {}
}
