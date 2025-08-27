import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
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
  private commentsRef = collection(this.firestore, 'comments');

  constructor(
    private utilsService: UtilsService,
    private firestore: Firestore
  ) {}

  /** 🔥 Flux en temps réel de tous les utilisateurs */
  get comments$(): Observable<Comment[]> {
    return collectionData(this.commentsRef, { idField: 'id' }).pipe(
      map((users: any[]) => users.sort((a, b) => a.dateCreation.localeCompare(b.dateCreation)))
    );
  }

  /// Get Single Comment By Key
  async getComment(key: string): Promise<Comment> {
    const qry = query(this.commentsRef, where('key', '==', key));
    const snap = await getDocs(qry);
    if (snap.empty) throw new Error('No such document!');
    return snap.docs[0].data() as Comment;
  }

  /// Get Comments By ProductKey /// OK
  async getCommentsByProductKey(productKey: string): Promise<Comment[]> {
    const qry = query(this.commentsRef, where('productKey', '==', productKey));
    const querySnapshot = await getDocs(qry);

    if (querySnapshot.empty) {
      console.error('No comments found for this product!');
      return []; // retourne un tableau vide si pas de commentaire
    }

    // Map tous les documents en objets Comment
    const comments: Comment[] = querySnapshot.docs.map(doc => doc.data() as Comment);
    return comments;
  }

  /// Create Comment /// OK
  createComment(comment: Comment) {
    addDoc(this.commentsRef, {
      ...comment,
      key: this.utilsService.getKey(),
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update Comment /// OK
  async updateComment(key: string, comment: Comment) {
    const docSnap = await this.utilsService.getDocByKey(this.commentsRef, key);
    if (docSnap) {
      const updated = {
        ...comment,
        dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
      };
      await updateDoc(docSnap.ref, updated as any);
    }
  }

  /// Remove Comment /// OK
  async removeComment(comment: Comment) {
    const docSnap = await this.utilsService.getDocByKey(this.commentsRef, comment.key);
    if (docSnap) {
      await deleteDoc(docSnap.ref);
    }
  }
}
