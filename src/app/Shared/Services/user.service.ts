import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { Firestore, collectionData, collection, addDoc, where, query, getDocs, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { UtilsService } from './Utils.service';
import { FileUploadService } from './UploadFile.service';
import { FileUpload } from '../Models/FileUpload.Model';
import { formatDate } from '@angular/common';
import { User } from '../Models/User.Model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private user!: User;
  private db: any;
  users$!: Observable<User[]>;
  usersSubject = new Subject<any[]>();

  constructor(private utilsService: UtilsService, private fileUploadService: FileUploadService, private firestore: Firestore) {
    this.db = collection(this.firestore, 'users');
    //this.getUsers();
  }

  emitUsers() {
    this.usersSubject.next(this.users);
  }

  /// Get All User /// OK
  getUsers() {
    this.users$ = collectionData(this.db) as Observable<User[]>;

    this.users$.subscribe((users: User[]) => {
      this.users = users;

      this.emitUsers();
    }, (error) => {
      console.log(error);
    }, () => {
      console.log('Users Chargé!');
    });
  }

  /// Get Single Tags /// OK
  getUser(key: string) {
    return new Promise(
      (resolve, reject) => {
        var qry = query(this.db, where("key", "==", key));

        getDocs(qry).then((querySnapshot) => {
          if (querySnapshot) {
            console.log("Document data:", querySnapshot);
            querySnapshot.docs.forEach(element => {
              this.user = element.data() as User;
            });
            resolve(this.user);
          } else {
            //doc.data() will be undefined in this case
            console.error("No such document!");
            reject("No such document!")
          }
        });
      });
  }

  /// Create User /// OK
  createUser(user: User) {
    addDoc(this.db, {
      key: this.utilsService.getKey(),
      pseudo: user.pseudo,
      email: user.email,
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update User /// OK
  updateUser(key: string, user: User) {
    this.user.surname = user.surname;
    this.user.name = user.name;
    this.user.adress = user.adress;
    this.user.zipcode = user.zipcode;
    this.user.city = user.city;
    this.user.pictureUrl = user.pictureUrl;
    this.user.email = user.email;
    this.user.pictureUrl = user.pictureUrl;
    this.user.admin = user.admin;
    this.user.statut = user.statut;
    this.user.dateModification = formatDate(new Date(), 'dd/MM/yyyy', 'en');

    this.utilsService.getDocByKey(this.db, key).then((doc: any) => {
      updateDoc(doc.ref, this.user);
    });
  }

  /// Remove User /// OK
  removeUser(user: User) {
    if (user.pictureUrl) {
      this.fileUploadService.getFileUpload(user.pictureUrl).then((fileUpload) => {
        return this.fileUploadService.deleteFile(fileUpload as FileUpload);
      });
    }

    this.utilsService.getDocByKey(this.db, user.key).then((doc: any) => {
      deleteDoc(doc.ref);
    });
  }

  /// Validator Existing Pseudo /// OK
  existingPseudoValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      const debounceTime = 10; //milliseconds
      return timer(debounceTime).pipe(switchMap(() => {
        return this.isPseudoAvailable(control.value)
          .then(result => result ? null : { "pseudoExists": true });
      }));
    };
  }

  /// Async Validator Existing Pseudo /// OK
  async isPseudoAvailable(value: string): Promise<boolean> {
    return getDocs(query(this.db, where("pseudo", "==", value)))
      .then((documentSnapshot) => {
        console.log("isPseudoAvailable");
        console.log("Value: " + value);
        console.log("documentSnapshot: " + documentSnapshot.empty)

        return documentSnapshot.empty as boolean;
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
        return false;
      });
  }

  existingEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      const debounceTime = 10; //milliseconds
      return timer(debounceTime).pipe(switchMap(() => {
        return this.isEmailAvailable(control.value)
          .then(result => result ? null : { "emailExists": true });
      }));
    };
  }

  /// Async Validator Existing Email /// OK
  async isEmailAvailable(value: string): Promise<boolean> {
    return getDocs(query(this.db, where("email", "==", value)))
      .then((documentSnapshot) => {
        console.log("isPseudoAvailable");
        console.log("Value: " + value);
        console.log("documentSnapshot: " + documentSnapshot.empty)

        return documentSnapshot.empty as boolean;
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
        return false;
      });
  }
}