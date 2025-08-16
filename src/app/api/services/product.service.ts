import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Product } from '../models/class/product';
import * as firebaseStorage from 'firebase/storage';
import { getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
  where,
  query,
  getDocs,
  deleteDoc
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { FileUploadService } from './upload-file.service';
import { FileUpload } from '../models/class/file-upload';
import { updateDoc } from '@firebase/firestore';
import { formatDate } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private db;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(
    private utilsService: UtilsService,
    private fileUploadService: FileUploadService,
    private firestore: Firestore
  ) {
    this.db = collection(this.firestore, 'products');
    this.listenToProducts();
  }

  /// 🔥 écoute Firestore en temps réel
  private listenToProducts() {
    collectionData(this.db, { idField: 'id' })
      .pipe(map((products: any[]) => products.sort((a, b) => a.title.localeCompare(b.title))))
      .subscribe({
        next: (products: Product[]) => this.productsSubject.next(products),
        error: err => console.error('Erreur chargement produits', err),
        complete: () => console.log('Produits chargés !')
      });
  }

  /// Get Single Product
  async getProduct(key: string): Promise<Product> {
    const qry = query(this.db, where('key', '==', key));
    const querySnapshot = await getDocs(qry);
    if (querySnapshot.empty) {
      throw new Error('No such document!');
    }
    return querySnapshot.docs[0].data() as Product;
  }

  /// Create Product
  createProduct(product: Product) {
    return addDoc(this.db, {
      key: this.utilsService.getKey(),
      title: product.title,
      titleContent: product.titleContent,
      content: product.content,
      author: product.author,
      size: product.size,
      time: product.time,
      date: product.date,
      pictureUrl: product.pictureUrl,
      tagsKey: product.tagsKey,
      perlerTypesKey: product.perlerTypesKey,
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update Product
  updateProduct(key: string, product: Product) {
    this.utilsService.getDocByKey(this.db, key).then((doc: any) => {
      const updated: Product = {
        ...product,
        dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
      };
      updateDoc(doc.ref, updated);
    });
  }

  /// Remove Product + Suppression de l'image
  async removeProduct(product: Product) {
    if (product.pictureUrl) {
      const fileUpload = await this.fileUploadService.getFileUpload(product.pictureUrl);
      await this.fileUploadService.deleteFile(fileUpload as FileUpload);
    }

    const doc = await this.utilsService.getDocByKey(this.db, product.key);
    return deleteDoc(doc.ref);
  }

  /// Upload File in Storage
  uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const almostUniqueFileName = Date.now().toString();
      const upload = firebaseStorage.ref(storage, file.name + '_' + almostUniqueFileName);

      uploadBytes(upload, file).then(
        async () => {
          const url = await getDownloadURL(upload);
          console.log('Chargement…');
          resolve(url);
        },
        error => {
          console.error('Erreur de chargement ! : ' + error);
          reject(error);
        }
      );
    });
  }
}
