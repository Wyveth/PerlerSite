import { BreadcrumbsComponent } from 'src/app/Shared/Component/breadcrumbs/breadcrumbs.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
import { BaseComponent } from 'src/app/Shared/Component/base/base.component';
import { AppResource } from 'src/app/Shared/Models/app.resource';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, UserFormComponent]
})
export class UserEditComponent extends BaseComponent {
  constructor(resources: AppResource) {
    super(resources);
  }
}
