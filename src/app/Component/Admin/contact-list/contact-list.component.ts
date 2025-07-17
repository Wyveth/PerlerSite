import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/Shared/Models/Contact.Model';
import { ContactService } from 'src/app/Shared/Services/Contact.service';

@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss'],
    standalone: false
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts!: any[];
  contactSubscription!: Subscription;

  constructor(private contactService: ContactService, private router: Router) { }

  ngOnInit() {
    this.contactSubscription = this.contactService.contactsSubject.subscribe(
      (contacts: any[]) => {
        this.contacts = contacts;
      }
    );
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
