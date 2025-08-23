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
      const updated: Tag = {
        ...tag,
        dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
      };
      updateDoc(doc.ref, updated);
    }
  }

  /// Remove Tag + suppression image si existante
  async removeTag(tag: Tag) {
    if (tag.pictureUrl) {
      const fileUpload = await this.fileUploadService.getFileUpload(tag.pictureUrl);
      await this.fileUploadService.deleteFile(fileUpload as FileUpload);
    }

    const doc = await this.utilsService.getDocByKey(this.db, tag.key);
    return deleteDoc(doc.ref);
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
  existingTagCodeValidator(edit: boolean): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      const debounceTime = 10; //milliseconds
      return timer(debounceTime).pipe(
        switchMap(() => {
          return this.isTagCodeAvailable(control.value, edit).then(result =>
            result ? null : { tagCodeExists: true }
          );
        })
      );
    };
  }
}
