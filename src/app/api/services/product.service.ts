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
  async updateProduct(key: string, product: Product) {
    const doc = await this.utilsService.getDocByKey(this.db, key);
    if (doc) {
      const updated = {
        ...product,
        dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
      };
      await updateDoc(doc.ref, updated as { [key: string]: any }); // Cast to the appropriate type
    }
  }

  /// Remove Product + Suppression de l'image
  async removeProduct(product: Product) {
    try {
      if (product.pictureUrl && product.pictureUrl.length) {
        // 1️⃣ Récupérer les fichiers Firestore correspondant aux URLs
        const filesUpload = await this.fileUploadService.getFilesUpload(product.pictureUrl);
        // 2️⃣ Supprimer tous les fichiers (Firestore + Storage) en parallèle
        const deletePromises = filesUpload
          .filter(f => f.key && f.url) // utiliser path pour Storage
          .map(f => this.fileUploadService.deleteFile(f as FileUpload));

        await Promise.all(deletePromises);
      }

      // 3️⃣ Supprimer le document Tag dans Firestore
      const doc = await this.utilsService.getDocByKey(this.db, product.key);
      await deleteDoc(doc.ref);

      console.log('✅ Produit supprimé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du Produit:', error);
    }
  }
}
