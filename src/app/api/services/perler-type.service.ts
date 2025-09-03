import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';
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
  private perlerTypesRef = collection(this.firestore, 'perlerTypes');

  constructor(
    private utilsService: UtilsService,
    private firestore: Firestore
  ) {}

  /** 🔥 Flux en temps réel de tous les types de perle */
  get perlerTypes$(): Observable<PerlerType[]> {
    return collectionData(this.perlerTypesRef, { idField: 'id' }).pipe(
      map((perlerTypes: any[]) => perlerTypes.sort((a, b) => a.libelle.localeCompare(b.libelle)))
    );
  }

  /// Get Single Perler Type
  async getPerlerType(key: string): Promise<PerlerType> {
    const qry = query(this.perlerTypesRef, where('key', '==', key));
    const snap = await getDocs(qry);
    if (snap.empty) throw new Error('No such document!');
    return snap.docs[0].data() as PerlerType;
  }

  /// Create Perler Type
  createPerlerType(perlerType: PerlerType) {
    return addDoc(this.perlerTypesRef, {
      ...perlerType,
      key: this.utilsService.getKey(),
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update Perler Type
  async updatePerlerType(key: string, perlerType: PerlerType) {
    const docSnap = await this.utilsService.getDocByKey(this.perlerTypesRef, key);
    if (docSnap) {
      const updated = {
        ...perlerType,
        dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
      };
      await updateDoc(docSnap.ref, updated as any);
    }
  }

  /// Remove Perler Type
  async removePerlerType(perlerType: PerlerType) {
    const docSnap = await this.utilsService.getDocByKey(this.perlerTypesRef, perlerType.key);
    if (docSnap) {
      await deleteDoc(docSnap.ref);
    }
  }

  /// Vérifie si une référence existe
  async isPerlerTypeRefAvailable(
    value: string,
    edit: boolean,
    current?: PerlerType
  ): Promise<boolean> {
    const querySnapshot = await getDocs(
      query(this.perlerTypesRef, where('reference', '==', value))
    );
    if (!edit) {
      if (current && value === current.reference) return true;
      return querySnapshot.empty;
    } else {
      return querySnapshot.empty;
    }
  }

  /// Validator Existing Perler Type Référence /// OK
  existingPerlerTypeRefValidator(editMode: boolean): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // si pas de valeur → pas d’erreur
      if (!control.value) {
        return of(null);
      }

      // si mode édition et le code n’a pas changé → pas d’erreur
      if (editMode && control.pristine) {
        return of(null);
      }

      // debounce de 300ms pour éviter les requêtes à chaque frappe
      return timer(300).pipe(
        switchMap(() =>
          this.isPerlerTypeRefAvailable(control.value, editMode).then(isAvailable =>
            isAvailable ? null : { perlerTypeRefExists: true }
          )
        ),
        catchError(() => of(null)) // en cas d’erreur API → on ne bloque pas le formulaire
      );
    };
  }
}
