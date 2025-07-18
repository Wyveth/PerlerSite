import { BreadcrumbsComponent } from 'src/app/Shared/Component/breadcrumbs/breadcrumbs.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Shared/Models/User.Model';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss'],
    standalone: true,
    imports: [CommonModule, BreadcrumbsComponent, UserFormComponent]
})
export class UserEditComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
