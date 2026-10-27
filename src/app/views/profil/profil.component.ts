import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreadcrumbsComponent } from 'src/app/Shared/Component/breadcrumbs/breadcrumbs.component';
import { UserFormComponent } from '../admin/user/user-form/user-form.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { OrdererListComponent } from '../orderer-list/orderer-list.component';
import { BaseComponent } from 'src/app/Shared/Component/base/base.component';
import { AppResource } from 'src/app/Shared/Models/app.resource';

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
export class ProfilComponent extends BaseComponent {
  constructor(resources: AppResource) {
    super(resources);
  }
}
