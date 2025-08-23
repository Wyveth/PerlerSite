import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, timer } from 'rxjs';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc
} from '@angular/fire/firestore';
import { formatDate } from '@angular/common';
import { PerlerType } from '../models/class/perler-type';
import { UtilsService } from './utils.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PerlerTypeService {
  private db;
  private perlerTypesSubject = new BehaviorSubject<PerlerType[]>([]);
  perlerTypes$ = this.perlerTypesSubject.asObservable();

  constructor(
    private utilsService: UtilsService,
    private firestore: Firestore
  ) {
    this.db = collection(this.firestore, 'perlerTypes');
    this.listenToPerlerTypes();
  }

  /// 🔥 Écoute Firestore en temps réel
  private listenToPerlerTypes() {
    collectionData(this.db, { idField: 'id' })
      .pipe(
        map((perlerTypes: any[]) =>
          perlerTypes.sort((a, b) => a.reference.localeCompare(b.reference))
        )
      )
      .subscribe({
        next: (perlerTypes: PerlerType[]) => {
          this.perlerTypesSubject.next(perlerTypes);
        },
        error: err => console.error('Erreur chargement perler types', err),
        complete: () => console.log('Perler Types chargés !')
      });
  }

  /// Get Single Perler Type
  async getPerlerType(key: string): Promise<PerlerType> {
    const qry = query(this.db, where('key', '==', key));
    const querySnapshot = await getDocs(qry);
    if (querySnapshot.empty) {
      throw new Error('No such document!');
    }
    return querySnapshot.docs[0].data() as PerlerType;
  }

  /// Create Perler Type
  createPerlerType(perlerType: PerlerType) {
    return addDoc(this.db, {
      key: this.utilsService.getKey(),
      reference: perlerType.reference,
      libelle: perlerType.libelle,
      color: perlerType.color,
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update Perler Type
  async updatePerlerType(key: string, perlerType: PerlerType) {
    const doc = await this.utilsService.getDocByKey(this.db, key);
    if (doc) {
      const updated: PerlerType = {
        ...perlerType,
        dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
      };
      updateDoc(doc.ref, updated);
    }
  }

  /// Remove Perler Type
  async removePerlerType(perlerType: PerlerType) {
    const doc = await this.utilsService.getDocByKey(this.db, perlerType.key);
    if (doc) {
      await deleteDoc(doc.ref);
    }
  }

  /// Vérifie si une référence existe
  async isPerlerTypeRefAvailable(
    value: string,
    edit: boolean,
    current?: PerlerType
  ): Promise<boolean> {
    const querySnapshot = await getDocs(query(this.db, where('reference', '==', value)));
    if (!edit) {
      if (current && value === current.reference) return true;
      return querySnapshot.empty;
    } else {
      return querySnapshot.empty;
    }
  }

  /// Validator Existing Perler Type Référence /// OK
  existingPerlerTypeRefValidator(edit: boolean): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      const debounceTime = 10; //milliseconds
      return timer(debounceTime).pipe(
        switchMap(() => {
          return this.isPerlerTypeRefAvailable(control.value, edit).then(result =>
            result ? null : { perlerTypeRefExists: true }
          );
        })
      );
    };
  }
}
