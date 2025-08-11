import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { User } from 'src/app/api/models/class/user';
import { UserService } from 'src/app/api/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent]
})
export class UserListComponent implements OnInit {
  users!: any[];
  userSubscription!: Subscription;
  user!: User;

  constructor(
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.userSubscription = this.userService.usersSubject.subscribe((users: any[]) => {
      this.users = users;
    });
    this.userService.emitUsers();
  }

  onEditUser(key: string) {
    this.router.navigate(['/users', 'editA', key]);
  }

  onDeleteUser(user: User) {
    this.userService.removeUser(user);
  }

  onUpdateAdmin(key: string) {
    this.userService.getUser(key).then((user: any) => {
      if (user.admin === true) {
        this.userService.updateOffAdmin(user);
      } else if (user.admin === false) {
        this.userService.updateOnAdmin(user);
      }
    });
  }

  onUpdateDisabled(key: string) {
    this.userService.getUser(key).then((user: any) => {
      if (user.disabled === true) {
        this.userService.updateOffDisabled(user);
      } else if (user.disabled === false) {
        this.userService.updateOnDisabled(user);
      }
    });
  }

  open(content: any, user: User) {
    this.user = user;
    this.modalService.open(content);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
