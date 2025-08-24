import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { Contact } from '../models/class/contact';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private db;
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  constructor(
    private utilsService: UtilsService,
    private firestore: Firestore
  ) {
    this.db = collection(this.firestore, 'contacts');
    this.listenToContacts();
  }

  /// 🔥 Écoute Firestore en temps réel
  private listenToContacts() {
    collectionData(this.db, { idField: 'id' })
      .pipe(map((contacts: any[]) => contacts.sort((a, b) => a.email.localeCompare(b.email))))
      .subscribe({
        next: (contacts: Contact[]) => {
          this.contactsSubject.next(contacts);
        },
        error: err => console.error('Erreur chargement contacts', err),
        complete: () => console.log('Contacts chargés !')
      });
  }

  /// Get Single Contact
  async getContact(key: string): Promise<Contact> {
    const qry = query(this.db, where('key', '==', key));
    const querySnapshot = await getDocs(qry);
    if (querySnapshot.empty) {
      throw new Error('No such document!');
    }
    return querySnapshot.docs[0].data() as Contact;
  }

  /// Create Contact /// OK
  createContact(contact: Contact) {
    return addDoc(this.db, {
      key: this.utilsService.getKey(),
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update Contact
  async updateContact(key: string, contact: Contact) {
    const doc = await this.utilsService.getDocByKey(this.db, key);
    if (doc) {
      const updated: Contact = {
        ...contact,
        dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
      };
      updateDoc(doc.ref, updated);
    }
  }

  /// Remove Contact
  async removeContact(contact: Contact) {
    const doc = await this.utilsService.getDocByKey(this.db, contact.key);
    if (doc) {
      await deleteDoc(doc.ref);
    }
  }
}
