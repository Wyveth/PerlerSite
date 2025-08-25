import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  DocumentSnapshot,
  getDocs,
  query,
  where
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() {}

  getKey(): any {
    return generateUUID();
  }

  async getDocByKey(
    db: CollectionReference<DocumentData>,
    key: string
  ): Promise<DocumentSnapshot<DocumentData>> {
    const qry = query(db, where('key', '==', key));
    const querySnapshot = await getDocs(qry);

    if (querySnapshot.empty) {
      throw new Error('No document found with key: ' + key);
    }

    // Retourne le premier document correspondant
    return querySnapshot.docs[0];
  }
}

function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
