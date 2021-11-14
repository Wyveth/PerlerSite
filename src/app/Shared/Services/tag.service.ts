import { Injectable } from '@angular/core';
//import { addDoc, collection,  deleteDoc,  doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where  } from 'firebase/firestore';
import { Observable, of, Subject, timer } from 'rxjs';
import { Tag } from '../Models/Tag.Model';
import { Firestore, collectionData, collection, addDoc, where, query, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { UtilsService } from './Utils.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tags: Tag[] = [];
  private tag!: Tag;
  private db: any;
  tags$!: Observable<Tag[]>;
  tagsSubject = new Subject<any[]>();

  tagDDL: Array<{ key: string, code: string }> = [];

  constructor(private http: HttpClient, private utilsService: UtilsService, private firestore: Firestore) {
    this.db = collection(this.firestore, 'tags');
    this.getTags();
  }

  emitTags() {
    this.tagsSubject.next(this.tags);
  }

  /// Get All Tags /// OK
  getTags() {
    this.tags$ = collectionData(this.db) as Observable<Tag[]>;

    this.tags$.subscribe((tags: Tag[]) => {
      this.tags = tags;

      this.emitTags();
    }, (error) => {
      console.log(error);
    }, () => {
      console.log('Tags Chargé!');
    });
  }

  /// Get Single Tags /// OK
  getTag(key: string) {
    return new Promise(
      (resolve, reject) => {
        var qry = query(this.db, where("key", "==", key));

        getDocs(qry).then((querySnapshot) => {
          if (querySnapshot) {
            console.log("Document data:", querySnapshot);
            querySnapshot.docs.forEach(element => {
              this.tag = element.data() as Tag;
            });
            resolve(this.tag);
          } else {
            //doc.data() will be undefined in this case
            console.error("No such document!");
            reject("No such document!")
          }
        });
      });
  }

  /// Create Tag /// OK
  createTag(tag: Tag) {
    addDoc(this.db, { key: this.utilsService.getKey(), code: tag.code, libelle: tag.libelle });
  }

  updateTag(key: string, tag: Tag) {
    this.tag.code = tag.code;
    this.tag.libelle = tag.libelle;

    this.utilsService.getDocByKey(this.db, key).then((doc: any) => {
      updateDoc(doc.ref, this.tag);
    });
  }

  /// Remove Tag /// OK
  removeTag(tag: Tag) {
    this.utilsService.getDocByKey(this.db, tag.key).then((doc: any) => {
      deleteDoc(doc.ref);
    });
  }

  /// Validator Existing Tag /// OK
  existingTagCodeValidator(edit: boolean): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      const debounceTime = 10; //milliseconds
      return timer(debounceTime).pipe(switchMap(() => {
        return this.isTagCodeAvailable(control.value, edit)
          .then(result => result ? null : { "tagCodeExists": true });
      }));
    };
  }

  /// Async Validator Existing Tag /// OK
  async isTagCodeAvailable(value: string, edit: boolean): Promise<boolean> {
    return getDocs(query(this.db, where("code", "==", value)))
      .then((documentSnapshot) => {
        if (!edit) {
          if (value == this.tag.code) {
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