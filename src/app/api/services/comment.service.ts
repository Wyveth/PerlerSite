import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
import { UtilsService } from './utils.service';
import { formatDate } from '@angular/common';
import { Comment } from '../models/class/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private comments: Comment[] = [];
  private comment!: Comment;
  private db: any;
  comments$!: Observable<Comment[]>;
  commentsSubject = new Subject<any[]>();

  constructor(
    private utilsService: UtilsService,
    private firestore: Firestore
  ) {
    this.db = collection(this.firestore, 'comments');
  }

  emitComments() {
    this.commentsSubject.next(this.comments);
  }

  /// Get All Comments /// OK
  getComments() {
    this.comments$ = collectionData(this.db) as Observable<Comment[]>;

    this.comments$.subscribe(
      (comments: Comment[]) => {
        this.comments = comments;

        this.emitComments();
      },
      error => {
        console.log(error);
      },
      () => {
        console.log('Comments Chargé!');
      }
    );
  }

  /// Get Single Comment /// OK
  getComment(key: string) {
    return new Promise((resolve, reject) => {
      var qry = query(this.db, where('key', '==', key));

      getDocs(qry).then(querySnapshot => {
        if (querySnapshot) {
          console.log('Document data:', querySnapshot);
          querySnapshot.docs.forEach(element => {
            this.comment = element.data() as Comment;
          });
          resolve(this.comment);
        } else {
          //doc.data() will be undefined in this case
          console.error('No such document!');
          reject('No such document!');
        }
      });
    });
  }

  /// Get Comments By ProductKey /// OK
  getCommentsByProductKey(productKey: string) {
    return new Promise((resolve, reject) => {
      var qry = query(this.db, where('productKey', '==', productKey));

      getDocs(qry).then(querySnapshot => {
        if (querySnapshot) {
          console.log('Document data:', querySnapshot);
          querySnapshot.docs.forEach(element => {
            this.comments.push(element.data() as Comment);
          });
          resolve(this.comment);
        } else {
          //doc.data() will be undefined in this case
          console.error('No such document!');
          reject('No such document!');
        }
      });
    });
  }

  /// Create Comment /// OK
  createComment(comment: Comment) {
    addDoc(this.db, {
      key: this.utilsService.getKey(),
      note: comment.note,
      comment: comment.comment,
      productKey: comment.productKey,
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update Comment /// OK
  updateComment(key: string, comment: Comment) {
    this.comment.note = comment.note;
    this.comment.comment = comment.comment;
    this.comment.dateModification = formatDate(new Date(), 'dd/MM/yyyy', 'en');

    this.utilsService.getDocByKey(this.db, key).then((doc: any) => {
      updateDoc(doc.ref, this.comment);
    });
  }

  /// Remove Comment /// OK
  removeComment(comment: Comment) {
    this.utilsService.getDocByKey(this.db, comment.key).then((doc: any) => {
      deleteDoc(doc.ref);
    });
  }
}
