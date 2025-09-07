import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { User } from 'src/app/api/models/class/user';
import { UserService } from 'src/app/api/services/user.service';
import { OverlayButton } from 'src/app/shared/component/image-overlay/image-overlay.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { severity } from 'src/app/shared/enum/severity';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, TableModule]
})
export class UserListComponent extends BaseComponent {
  usersWithButtons$: Observable<{ user: User; buttons: OverlayButton[] }[]>;

  constructor(
    resource: AppResource,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router
  ) {
    super(resource);

    this.usersWithButtons$ = this.userService.users$.pipe(
      map(users =>
        users.map(user => ({
          user,
          buttons: [
            {
              icon: 'pi pi-pencil',
              label: this.resource.button.edit,
              color: 'p-button-warn',
              command: () => this.onEdit(user.key)
            },
            {
              icon: 'pi pi-trash',
              label: this.resource.button.delete,
              color: 'p-button-danger',
              command: (event?: Event) => this.onDelete(event, user)
            }
          ]
        }))
      )
    );
  }

  onEdit(key: string) {
    this.router.navigate([this.resource.router.routes.users, this.resource.router.edit, key]);
  }

  onDelete(event: Event | undefined, user: User) {
    event?.stopPropagation();
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: this.resource.generic.delete_confirm_mf.format(
        this.resource.user.title.toLowerCase(),
        user.displayName
      ),
      header: this.resource.generic.attention,
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: this.resource.button.cancel,
      rejectButtonProps: {
        label: this.resource.button.cancel,
        severity: severity.secondary,
        outlined: true
      },
      acceptButtonProps: {
        label: this.resource.button.delete,
        severity: severity.error
      },

      accept: () => {
        this.userService.removeUser(user);
        this.messageService.add({
          severity: severity.info,
          summary: this.resource.generic.confirm,
          detail: this.resource.generic.delete_success_mf.format(
            this.resource.user.title.toLowerCase(),
            user.displayName
          )
        });
      },
      reject: () => {
        this.messageService.add({
          severity: severity.secondary,
          summary: this.resource.generic.cancel,
          detail: this.resource.generic.delete_cancelled
        });
      }
    });
  }

  setAdmin(user: User) {
    this.userService.updateField(user.key, 'admin', !user.admin);
  }

  setDisabled(user: User) {
    this.userService.updateField(user.key, 'disabled', !user.disabled);
  }
}
