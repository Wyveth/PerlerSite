import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/api/models/class/user';
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
