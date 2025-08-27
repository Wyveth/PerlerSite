import { Injectable } from '@angular/core';
import { Observable, map, timer, switchMap } from 'rxjs';
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
  private usersRef = collection(this.firestore, 'users');

  constructor(
    private utilsService: UtilsService,
    private fileUploadService: FileUploadService,
    private firestore: Firestore
  ) {}

  /** 🔥 Flux en temps réel de tous les utilisateurs */
  get users$(): Observable<User[]> {
    return collectionData(this.usersRef, { idField: 'id' }).pipe(
      map((users: any[]) => users.sort((a, b) => a.displayName.localeCompare(b.displayName)))
    );
  }

  /// Get Single User By Key
  async getUser(key: string): Promise<User> {
    const qry = query(this.usersRef, where('key', '==', key));
    const snap = await getDocs(qry);
    if (snap.empty) throw new Error('No such document!');
    return snap.docs[0].data() as User;
  }

  /// Get Single User By Email
  async getUserByEmail(email: string | null): Promise<User> {
    const qry = query(this.usersRef, where('email', '==', email));
    const snap = await getDocs(qry);
    if (snap.empty) throw new Error('No such document!');
    return snap.docs[0].data() as User;
  }

  /// Create User
  createUser(user: User) {
    return addDoc(this.usersRef, {
      ...user,
      key: this.utilsService.getKey(),
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update User
  async updateUser(key: string, user: User) {
    const docSnap = await this.utilsService.getDocByKey(this.usersRef, key);
    if (docSnap) {
      const updated = {
        ...user,
        dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
      };
      await updateDoc(docSnap.ref, updated as any);
    }
  }

  /** Mettre à jour un champ simple */
  async updateField(key: string, field: keyof User, value: any) {
    const docSnap = await this.utilsService.getDocByKey(this.usersRef, key);
    if (docSnap) {
      await updateDoc(docSnap.ref, { [field]: value });
    }
  }

  /** Supprimer un utilisateur (et ses fichiers liés) */
  async removeUser(user: User) {
    if (user.pictureUrl) {
      const filesUpload = await this.fileUploadService.getFilesUpload(user.pictureUrl);
      filesUpload.forEach(fileUpload => {
        if (fileUpload.url) {
          this.fileUploadService.deleteFile(fileUpload as FileUpload);
        }
      });
    }

    const docSnap = await this.utilsService.getDocByKey(this.usersRef, user.key);
    if (docSnap) {
      await deleteDoc(docSnap.ref);
    }
  }

  // ---------------------
  // ✅ VALIDATEURS
  // ---------------------

  /**
   * Vérifie si une valeur existe déjà pour un champ donné
   */
  async isFieldAvailable(field: keyof User, value: any): Promise<boolean> {
    const snap = await getDocs(query(this.usersRef, where(field, '==', value)));
    return snap.empty;
  }

  /**
   * Génère un AsyncValidatorFn pour n'importe quel champ
   * Exemple : existingFieldValidator('email')
   */
  existingFieldValidator(field: keyof User): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(300).pipe(
        switchMap(() =>
          this.isFieldAvailable(field, control.value).then(isAvailable =>
            isAvailable ? null : { [`${field}Exists`]: true }
          )
        )
      );
    };
  }
}
