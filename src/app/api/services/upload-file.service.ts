import { Injectable } from '@angular/core';
import * as firebaseStorage from '@angular/fire/storage';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { FileUpload } from '../models/class/file-upload';
import { addDoc, collection, deleteDoc, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private basePath = '/uploads';
  private db: any;

  constructor(private firestore: Firestore, private utilsService: UtilsService) {
    this.db = collection(this.firestore, 'filesUpload');
  }

  pushFileToStorage(fileUpload: FileUpload): Promise<any> {
    return new Promise(
      (resolve, reject) => {
        const filePath = `${this.basePath}/${fileUpload.file.name}`;
        // Create a root reference
        const storage = firebaseStorage.getStorage();

        // Create a reference to Files
        const almostUniqueFileName = Date.now().toString();
        const upload = ref(storage, filePath + '_' + almostUniqueFileName);

        uploadBytes(upload, fileUpload.file).then((data: any) => {
          getDownloadURL(upload).then((url: string) => {
            fileUpload.url = url;
            resolve(fileUpload.url);
            console.log('Chargement…');
          });
          fileUpload.name = fileUpload.file.name;
        }, (error) => {
          console.log('Erreur de chargement ! : ' + error);
          reject(error);
        });
      }
    );
  }

  saveFileData(fileUpload: FileUpload): void {
    addDoc(this.db, { key: this.utilsService.getKey(), name: fileUpload.name, url: fileUpload.url, size: fileUpload.file.size, type: fileUpload.file.type });
  }

  getFileUpload(url: string) {
    return new Promise(
      (resolve, reject) => {
        var qry = query(this.db, where("url", "==", url));

        getDocs(qry).then((querySnapshot) => {
          if (querySnapshot) {
            //console.log("Document data:", querySnapshot);
            querySnapshot.docs.forEach(element => {
              resolve(element.data() as FileUpload);
            });

          } else {
            // doc.data() will be undefined in this case
            console.error("No such document!");
            reject("No such document!")
          }
        });
      });
  }

  getFiles(numberItems: number): any {
    return this.db.list(this.basePath, (ref: { limitToLast: (arg0: number) => any; }) =>
      ref.limitToLast(numberItems));
  }

  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        console.log('Direction la suppression dans le storage');
        this.deleteFileStorage(fileUpload.url);
      })
      .catch(error => console.log('Erreur: ' + error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return new Promise((resolve) => {
      var qry = query(this.db, where("key", "==", key));

      getDocs(qry).then((querySnapshot) => {
        if (querySnapshot) {
          console.log("Document data:", querySnapshot);
        } else {
          // doc.data() will be undefined in this case
          console.error("No such document!");
        }
        querySnapshot.forEach(function (doc) {
          deleteDoc(doc.ref);
          resolve();
        });
      });
    });
  }

  private deleteFileStorage(url: string): void {
    const storage = getStorage();
    // Create a reference to the file to delete
    const Ref = firebaseStorage.ref(storage, url);

    // Delete the file
    deleteObject(Ref).then(() => {
      // File deleted successfully
      console.log('Photo supprimé!');
    }).catch((error) => {
      // Uh-oh, an error occurred!
      console.log('La photo n\'a pas pu être supprimé! : ' + error);
    });
  }
}