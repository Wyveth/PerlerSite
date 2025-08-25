import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, timer } from 'rxjs';
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
import { Tag } from 'src/app/api/models/class/tag';
import { FileUpload } from 'src/app/api/models/class/file-upload';
import { UtilsService } from './utils.service';
import { FileUploadService } from './upload-file.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private db;
  private tagsSubject = new BehaviorSubject<Tag[]>([]);
  tags$ = this.tagsSubject.asObservable();

  constructor(
    private utilsService: UtilsService,
    private fileUploadService: FileUploadService,
    private firestore: Firestore
  ) {
    this.db = collection(this.firestore, 'tags');
    this.listenToTags();
  }

  /// 🔥 Écoute Firestore en temps réel
  private listenToTags() {
    collectionData(this.db, { idField: 'id' })
      .pipe(
        map((docs: any[]) =>
          docs
            .map(doc => doc as Tag) // caster correctement en Tag
            .sort((a, b) => a.code.localeCompare(b.code))
        )
      )
      .subscribe({
        next: (tags: Tag[]) => this.tagsSubject.next(tags),
        error: err => console.error('Erreur chargement tags', err),
        complete: () => console.log('Tags chargés !')
      });
  }

  /// Get Single Tag
  async getTag(key: string): Promise<Tag> {
    const qry = query(this.db, where('key', '==', key));
    const querySnapshot = await getDocs(qry);
    if (querySnapshot.empty) {
      throw new Error('No such document!');
    }
    return querySnapshot.docs[0].data() as Tag;
  }

  /// Create Tag
  createTag(tag: Tag) {
    return addDoc(this.db, {
      key: this.utilsService.getKey(),
      code: tag.code,
      libelle: tag.libelle,
      pictureUrl: tag.pictureUrl,
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update Tag
  async updateTag(key: string, tag: Tag) {
    const doc = await this.utilsService.getDocByKey(this.db, key);
    if (doc) {
      const updated = {
        ...tag,
        dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
      };
      await updateDoc(doc.ref, updated as { [key: string]: any }); // Cast to the appropriate type
    }
  }

  /// Remove Tag + suppression image si existante
  async removeTag(tag: Tag) {
    try {
      if (tag.pictureUrl && tag.pictureUrl.length) {
        // 1️⃣ Récupérer les fichiers Firestore correspondant aux URLs
        const filesUpload = await this.fileUploadService.getFilesUpload(tag.pictureUrl);
        // 2️⃣ Supprimer tous les fichiers (Firestore + Storage) en parallèle
        const deletePromises = filesUpload
          .filter(f => f.key && f.url) // utiliser path pour Storage
          .map(f => this.fileUploadService.deleteFile(f as FileUpload));

        await Promise.all(deletePromises);
      }

      // 3️⃣ Supprimer le document Tag dans Firestore
      const doc = await this.utilsService.getDocByKey(this.db, tag.key);
      await deleteDoc(doc.ref);

      console.log('✅ Tag supprimé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du Tag:', error);
    }
  }

  /// Vérifie si un code existe
  async isTagCodeAvailable(value: string, edit: boolean, currentTag?: Tag): Promise<boolean> {
    const querySnapshot = await getDocs(query(this.db, where('code', '==', value)));
    if (!edit) {
      if (currentTag && value === currentTag.code) return true;
      return querySnapshot.empty;
    } else {
      return querySnapshot.empty;
    }
  }

  /// Validator Existing Tag /// OK
  existingTagCodeValidator(editMode: boolean): AsyncValidatorFn {
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
          this.isTagCodeAvailable(control.value, editMode).then(isAvailable =>
            isAvailable ? null : { tagCodeExists: true }
          )
        ),
        catchError(() => of(null)) // en cas d’erreur API → on ne bloque pas le formulaire
      );
    };
  }
}
