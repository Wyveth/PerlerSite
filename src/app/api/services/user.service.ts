import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, timer, switchMap } from 'rxjs';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  where,
  query,
  getDocs,
  deleteDoc,
  updateDoc
} from '@angular/fire/firestore';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { UtilsService } from './utils.service';
import { FileUploadService } from './upload-file.service';
import { FileUpload } from '../models/class/file-upload';
import { formatDate } from '@angular/common';
import { User } from '../models/class/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private db;
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(
    private utilsService: UtilsService,
    private fileUploadService: FileUploadService,
    private firestore: Firestore
  ) {
    this.db = collection(this.firestore, 'users');
    this.listenToUsers();
  }

  /// 🔥 Écoute Firestore en temps réel
  private listenToUsers() {
    collectionData(this.db, { idField: 'id' })
      .pipe(map((user: any[]) => user.sort((a, b) => a.displayName.localeCompare(b.displayName))))
      .subscribe({
        next: (users: User[]) => {
          this.usersSubject.next(users);
        },
        error: err => console.error('Erreur chargement Utilisateurs', err),
        complete: () => console.log('Utilisateurs chargés !')
      });
  }

  /// Get Single User
  async getUser(key: string): Promise<User> {
    const qry = query(this.db, where('key', '==', key));
    const querySnapshot = await getDocs(qry);
    if (querySnapshot.empty) {
      throw new Error('No such document!');
    }
    return querySnapshot.docs[0].data() as User;
  }

  /// Get Single User By Email
  async getUserByEmail(email: string | null): Promise<User> {
    const qry = query(this.db, where('email', '==', email));
    const querySnapshot = await getDocs(qry);
    if (querySnapshot.empty) {
      throw new Error('No such document!');
    }
    return querySnapshot.docs[0].data() as User;
  }

  /// Create User
  createUser(user: User) {
    return addDoc(this.db, {
      key: this.utilsService.getKey(),
      displayName: user.displayName,
      email: user.email,
      admin: user.admin,
      disabled: user.disabled,
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update User
  async updateUser(key: string, user: User) {
    const doc = await this.utilsService.getDocByKey(this.db, key);
    if (doc) {
      const updated: User = {
        ...user,
        dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
      };
      updateDoc(doc.ref, updated);
    }
  }

  updateOffAdmin(user: User) {
    user.admin = false;

    this.utilsService.getDocByKey(this.db, user.key).then((doc: any) => {
      updateDoc(doc.ref, user);
    });
  }

  updateOnAdmin(user: User) {
    user.admin = true;

    this.utilsService.getDocByKey(this.db, user.key).then((doc: any) => {
      updateDoc(doc.ref, user);
    });
  }

  updateOffDisabled(user: User) {
    user.disabled = false;

    this.utilsService.getDocByKey(this.db, user.key).then((doc: any) => {
      updateDoc(doc.ref, user);
    });
  }

  updateOnDisabled(user: User) {
    user.disabled = true;

    this.utilsService.getDocByKey(this.db, user.key).then((doc: any) => {
      updateDoc(doc.ref, user);
    });
  }

  /// Remove User
  async removeUser(user: User) {
    if (user.pictureUrl) {
      this.fileUploadService.getFileUpload(user.pictureUrl).then(fileUpload => {
        return this.fileUploadService.deleteFile(fileUpload as FileUpload);
      });
    }

    const doc = await this.utilsService.getDocByKey(this.db, user.key);
    if (doc) {
      await deleteDoc(doc.ref);
    }
  }

  /// Validator Existing DisplayName /// OK
  existingDisplayNameValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      const debounceTime = 10; //milliseconds
      return timer(debounceTime).pipe(
        switchMap(() => {
          return this.isDisplayNameAvailable(control.value).then(result =>
            result ? null : { displayNameExists: true }
          );
        })
      );
    };
  }

  /// Async Validator Existing DisplayName /// OK
  async isDisplayNameAvailable(value: string): Promise<boolean> {
    return getDocs(query(this.db, where('displayName', '==', value)))
      .then(documentSnapshot => {
        return documentSnapshot.empty as boolean;
      })
      .catch(error => {
        console.error('Error getting documents: ', error);
        return false;
      });
  }

  existingEmailValidator(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      const debounceTime = 10; //milliseconds
      return timer(debounceTime).pipe(
        switchMap(() => {
          return this.isEmailAvailable(control.value).then(result =>
            result ? null : { emailExists: true }
          );
        })
      );
    };
  }

  /// Async Validator Existing Email /// OK
  async isEmailAvailable(value: string): Promise<boolean> {
    return getDocs(query(this.db, where('email', '==', value)))
      .then(documentSnapshot => {
        return documentSnapshot.empty as boolean;
      })
      .catch(error => {
        console.error('Error getting documents: ', error);
        return false;
      });
  }
}
