import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
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
import { switchMap } from 'rxjs/operators';
import { UtilsService } from './utils.service';
import { FileUploadService } from './upload-file.service';
import { formatDate } from '@angular/common';
import { Tag } from 'src/app/api/models/class/tag';
import { FileUpload } from 'src/app/api/models/class/file-upload';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tags: Tag[] = [];
  private tag!: Tag;
  private db: any;
  tags$!: Observable<Tag[]>;
  tagsSubject = new Subject<any[]>();

  tagDDL: Array<{ key: string; code: string }> = [];

  constructor(
    private utilsService: UtilsService,
    private fileUploadService: FileUploadService,
    private firestore: Firestore
  ) {
    this.db = collection(this.firestore, 'tags');
    this.getTags();
  }

  emitTags() {
    this.tagsSubject.next(this.tags);
  }

  /// Get All Tag /// OK
  getTags() {
    this.tags$ = collectionData(this.db) as Observable<Tag[]>;

    this.tags$.subscribe(
      (tags: Tag[]) => {
        this.tags = tags.sort((a, b) => a.code.localeCompare(b.code));

        this.emitTags();
      },
      error => {
        console.log(error);
      },
      () => {
        console.log('Tags Chargé!');
      }
    );
  }

  /// Get Single Tag /// OK
  getTag(key: string) {
    return new Promise((resolve, reject) => {
      var qry = query(this.db, where('key', '==', key));

      getDocs(qry).then(querySnapshot => {
        if (querySnapshot) {
          console.log('Document data:', querySnapshot);
          querySnapshot.docs.forEach(element => {
            this.tag = element.data() as Tag;
          });
          resolve(this.tag);
        } else {
          //doc.data() will be undefined in this case
          console.error('No such document!');
          reject('No such document!');
        }
      });
    });
  }

  /// Create Tag /// OK
  createTag(tag: Tag) {
    addDoc(this.db, {
      key: this.utilsService.getKey(),
      code: tag.code,
      libelle: tag.libelle,
      pictureUrl: tag.pictureUrl,
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update Tag /// OK
  updateTag(key: string, tag: Tag) {
    this.tag.code = tag.code;
    this.tag.libelle = tag.libelle;
    this.tag.pictureUrl = tag.pictureUrl;
    this.tag.dateModification = formatDate(new Date(), 'dd/MM/yyyy', 'en');

    this.utilsService.getDocByKey(this.db, key).then((doc: any) => {
      updateDoc(doc.ref, this.tag);
    });
  }

  /// Remove Tag /// OK
  removeTag(tag: Tag) {
    if (tag.pictureUrl) {
      this.fileUploadService.getFileUpload(tag.pictureUrl).then(fileUpload => {
        return this.fileUploadService.deleteFile(fileUpload as FileUpload);
      });
    }

    this.utilsService.getDocByKey(this.db, tag.key).then((doc: any) => {
      deleteDoc(doc.ref);
    });
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

  /// Async Validator Existing Tag /// OK
  async isTagCodeAvailable(value: string, edit: boolean): Promise<boolean> {
    return getDocs(query(this.db, where('code', '==', value)))
      .then(documentSnapshot => {
        if (!edit) {
          if (value == this.tag.code) {
            return true;
          } else {
            return documentSnapshot.empty as boolean;
          }
        } else {
          return documentSnapshot.empty as boolean;
        }
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
        return false;
      });
  }
}
