import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { PerlerType } from '../Models/PerlerType.Model';
import { Firestore, collectionData, collection, addDoc, where, query, getDocs, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { UtilsService } from './Utils.service';
import { formatDate } from '@angular/common';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerlerTypeService {
  private perlerTypes: PerlerType[] = [];
  private perlerType!: PerlerType;
  private db: any;
  perlerTypes$!: Observable<PerlerType[]>;
  perlerTypesSubject = new Subject<any[]>();

  perlerTypeDDL: Array<{ key: string, code: string }> = [];

  constructor(private utilsService: UtilsService, private firestore: Firestore) {
    this.db = collection(this.firestore, 'perlerTypes');
    this.getPerlerTypes();
  }

  emitPerlerTypes() {
    this.perlerTypesSubject.next(this.perlerTypes);
  }

  /// Get All Perler Types /// OK
  getPerlerTypes() {
    this.perlerTypes$ = collectionData(this.db) as Observable<PerlerType[]>;

    this.perlerTypes$.subscribe((perlerTypes: PerlerType[]) => {
      this.perlerTypes = perlerTypes;

      this.emitPerlerTypes();
    }, (error) => {
      console.log(error);
    }, () => {
      console.log('Perler Types Chargé!');
    });
  }

  /// Get Single Perler Types /// OK
  getPerlerType(key: string) {
    return new Promise(
      (resolve, reject) => {
        var qry = query(this.db, where("key", "==", key));

        getDocs(qry).then((querySnapshot) => {
          if (querySnapshot) {
            console.log("Document data:", querySnapshot);
            querySnapshot.docs.forEach(element => {
              this.perlerType = element.data() as PerlerType;
            });
            resolve(this.perlerType);
          } else {
            //doc.data() will be undefined in this case
            console.error("No such document!");
            reject("No such document!")
          }
        });
      });
  }

  /// Create Perler Type /// OK
  createPerlerType(perlerType: PerlerType) {
    addDoc(this.db, { key: this.utilsService.getKey(), 
      reference: perlerType.reference, 
      libelle: perlerType.libelle,
      color: perlerType.color,
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
     });
  }

  /// Update Perler Type /// OK
  updatePerlerType(key: string, perlerType: PerlerType) {
    this.perlerType.reference = perlerType.reference;
    this.perlerType.libelle = perlerType.libelle;
    this.perlerType.color = perlerType.color;
    this.perlerType.dateModification = formatDate(new Date(), 'dd/MM/yyyy', 'en');

    this.utilsService.getDocByKey(this.db, key).then((doc: any) => {
      updateDoc(doc.ref, this.perlerType);
    });
  }

  /// Remove Perler Type /// OK
  removePerlerType(perlerType: PerlerType) {
    this.utilsService.getDocByKey(this.db, perlerType.key).then((doc: any) => {
      deleteDoc(doc.ref);
    });
  }

  /// Validator Existing Perler Type Référence /// OK
  existingPerlerTypeRefValidator(edit: boolean): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      const debounceTime = 10; //milliseconds
      return timer(debounceTime).pipe(switchMap(() => {
        return this.isPerlerTypeRefAvailable(control.value, edit)
          .then(result => result ? null : { "perlerTypeRefExists": true });
      }));
    };
  }

  /// Async Validator Existing Perler Type Référence /// OK
  async isPerlerTypeRefAvailable(value: string, edit: boolean): Promise<boolean> {
    return getDocs(query(this.db, where("reference", "==", value)))
      .then((documentSnapshot) => {
        if (!edit) {
          if (value == this.perlerType.reference) {
            return true;
          }
          else {
            return documentSnapshot.empty as boolean
          }
        }
        else {
          return documentSnapshot.empty as boolean
        }
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
        return false;
      });
  }
}
