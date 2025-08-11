import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { Contact } from 'src/app/api/models/class/contact';
import { ContactService } from 'src/app/api/services/contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent]
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts!: any[];
  contactSubscription!: Subscription;

  constructor(
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit() {
    this.contactSubscription = this.contactService.contactsSubject.subscribe((contacts: any[]) => {
      this.contacts = contacts;
    });
    this.contactService.emitContacts();
  }

  onDeleteContact(contact: Contact) {
    this.contactService.removeContact(contact);
  }

  onEditContact(key: string) {
    this.router.navigate(['/contacts', 'edit', key]);
  }

  ngOnDestroy() {
    this.contactSubscription.unsubscribe();
  }
}
