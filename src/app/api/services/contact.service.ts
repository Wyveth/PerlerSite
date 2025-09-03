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
import { map, Observable } from 'rxjs';
import { Contact } from '../models/class/contact';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactsRef = collection(this.firestore, 'contacts');

  constructor(
    private utilsService: UtilsService,
    private firestore: Firestore
  ) {}

  /** 🔥 Flux en temps réel de tous les contacts */
  get contacts$(): Observable<Contact[]> {
    return collectionData(this.contactsRef, { idField: 'id' }).pipe(
      map((contacts: any[]) => contacts.sort((a, b) => a.email.localeCompare(b.email)))
    );
  }

  /// Get Single Contact
  async getContact(key: string): Promise<Contact> {
    const qry = query(this.contactsRef, where('key', '==', key));
    const snap = await getDocs(qry);
    if (snap.empty) throw new Error('No such document!');
    return snap.docs[0].data() as Contact;
  }

  /// Create Contact /// OK
  createContact(contact: Contact) {
    return addDoc(this.contactsRef, {
      ...contact,
      key: this.utilsService.getKey(),
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update Contact
  async updateContact(key: string, contact: Contact) {
    const docSnap = await this.utilsService.getDocByKey(this.contactsRef, key);
    if (docSnap) {
      const updated: Contact = {
        ...contact,
        dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
      };
      updateDoc(docSnap.ref, updated as { [key: string]: any });
    }
  }

  /// Remove Contact
  async removeContact(contact: Contact) {
    const docSnap = await this.utilsService.getDocByKey(this.contactsRef, contact.key);
    if (docSnap) {
      await deleteDoc(docSnap.ref);
    }
  }
}
