import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { Contact } from 'src/app/api/models/class/contact';
import { ContactService } from 'src/app/api/services/contact.service';
import { OverlayButton } from 'src/app/shared/component/image-overlay/image-overlay.component';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppResource } from 'src/app/shared/models/app.resource';
import { severity } from 'src/app/shared/enum/severity';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, TableModule]
})
export class ContactListComponent extends BaseComponent {
  contactsWithButtons$: Observable<{ contact: Contact; buttons: OverlayButton[] }[]>;

  constructor(
    resources: AppResource,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private contactService: ContactService,
    private router: Router
  ) {
    super(resources);

    this.contactsWithButtons$ = this.contactService.contacts$.pipe(
      map(contacts =>
        contacts.map(contact => ({
          contact,
          buttons: [
            {
              icon: 'pi pi-pencil',
              label: this.resource.button.edit,
              color: 'p-button-warn',
              command: () => this.onEdit(contact.key)
            },
            {
              icon: 'pi pi-trash',
              label: this.resource.button.delete,
              color: 'p-button-danger',
              command: (event?: Event) => this.onDelete(event, contact)
            }
          ]
        }))
      )
    );
  }

  onDelete(event: Event | undefined, contact: Contact) {
    event?.stopPropagation();
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: this.resource.generic.delete_confirm_m.format(
        this.resource.contact.title.toLowerCase(),
        contact.name
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
        this.contactService.removeContact(contact);
        this.messageService.add({
          severity: severity.info,
          summary: this.resource.generic.confirm,
          detail: this.resource.generic.delete_success_m.format(
            this.resource.contact.title.toLowerCase(),
            contact.name
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

  onEdit(key: string) {
    this.router.navigate(['contacts', 'edit', key]);
  }
}
