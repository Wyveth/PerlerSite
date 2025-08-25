import { Injectable } from '@angular/core';
import * as firebaseStorage from '@angular/fire/storage';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { FileUpload } from '../models/class/file-upload';
import {
  addDoc,
  collection,
  deleteDoc,
  Firestore,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private basePath = '/uploads';
  private db: any;

  constructor(
    private firestore: Firestore,
    private utilsService: UtilsService
  ) {
    this.db = collection(this.firestore, 'filesUpload');
  }

  async pushFileToStorage(fileUpload: FileUpload): Promise<FileUpload> {
    if (!fileUpload.file) {
      throw new Error('Le fichier est manquant pour l’upload.');
    }

    const storage = getStorage();
    const almostUniqueFileName = Date.now().toString();
    const filePath = `${this.basePath}/${almostUniqueFileName}_${fileUpload.file.name}`;
    const storageRef = ref(storage, filePath);

    // 1️⃣ Upload
    await uploadBytes(storageRef, fileUpload.file);

    // 2️⃣ Récupération URL
    const url = await getDownloadURL(storageRef);

    // 3️⃣ Ajout Firestore
    const docRef = await addDoc(this.db, {
      key: this.utilsService.getKey(), // Génère une clé unique
      name: fileUpload.file.name, // maintenant sûr
      url,
      size: fileUpload.file.size,
      type: fileUpload.file.type,
      path: filePath
    });

    // 4️⃣ Retourne objet complet
    return {
      key: docRef.id,
      name: fileUpload.file.name,
      url,
      size: fileUpload.file.size.toString(),
      type: fileUpload.file.type,
      //path: filePath,
      file: fileUpload.file
    };
  }

  async getFilesUpload(url: string | string[] | null): Promise<FileUpload[]> {
    if (!url || (Array.isArray(url) && url.length === 0)) {
      throw new Error('URL is empty or null');
    }

    // Transformer en tableau si string
    const urls = typeof url === 'string' ? [url] : url;

    const filesUpload: FileUpload[] = [];

    for (const u of urls!) {
      try {
        const qry = query(this.db, where('url', '==', u));
        const querySnapshot = await getDocs(qry);

        if (!querySnapshot.empty) {
          querySnapshot.docs.forEach(doc => {
            // Extraire les données et ajouter la clé Firestore
            const data = doc.data() as Omit<FileUpload, 'key' | 'file' | 'isNew'>;
            filesUpload.push({
              ...data
            } as FileUpload);
          });
        } else {
          console.warn('No document found for url:', u);
        }
      } catch (err) {
        console.error('Error getting document for url:', u, err);
      }
    }

    return filesUpload;
  }

  async getFiles(numberItems: number): Promise<FileUpload[]> {
    const q = query(
      this.db, // this.db = collection(this.firestore, 'filesUpload')
      orderBy('name'), // ou orderBy('createdAt', 'desc') si tu as une date
      limit(numberItems)
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Omit<FileUpload, 'key' | 'file' | 'isNew'>; // on prend seulement les champs stockés
      return {
        ...data,
        file: undefined, // ou null, on n’a pas le File ici
        isNew: false
      } as unknown as FileUpload; // Conversion en unknown avant FileUpload
    });
  }

  async deleteFile(fileUpload: FileUpload): Promise<void> {
    try {
      await this.deleteFileDatabase(fileUpload.key);
      await this.deleteFileStorage(fileUpload.url);
    } catch (error) {
      console.error('Erreur:', error);
    }
  }

  private async deleteFileDatabase(key: string): Promise<void> {
    try {
      const doc = await this.utilsService.getDocByKey(this.db, key);

      if (!doc.exists()) {
        console.warn('Aucun document trouvé pour la clé:', key);
        return;
      }

      await deleteDoc(doc.ref);
    } catch (err) {
      console.error('Erreur suppression document:', err);
    }
  }

  private async deleteFileStorage(path: string): Promise<void> {
    const storage = getStorage();
    const fileRef = ref(storage, path); // ici on utilise path, pas url

    await deleteObject(fileRef);
  }
}
