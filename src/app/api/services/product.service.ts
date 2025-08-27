import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Product } from '../models/class/product';
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
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsRef = collection(this.firestore, 'products');

  constructor(
    private utilsService: UtilsService,
    private fileUploadService: FileUploadService,
    private firestore: Firestore
  ) {}

  /** 🔥 Flux en temps réel de tous les utilisateurs */
  get products$(): Observable<Product[]> {
    return collectionData(this.productsRef, { idField: 'id' }).pipe(
      map((products: any[]) => products.sort((a, b) => a.title.localeCompare(b.title)))
    );
  }

  /// Get Single Product
  async getProduct(key: string): Promise<Product> {
    const qry = query(this.productsRef, where('key', '==', key));
    const snap = await getDocs(qry);
    if (snap.empty) throw new Error('No such document!');
    return snap.docs[0].data() as Product;
  }

  /// Create Product
  createProduct(product: Product) {
    return addDoc(this.productsRef, {
      ...product,
      key: this.utilsService.getKey(),
      dateCreation: formatDate(new Date(), 'dd/MM/yyyy', 'en'),
      dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
    });
  }

  /// Update Product
  async updateProduct(key: string, product: Product) {
    const docSnap = await this.utilsService.getDocByKey(this.productsRef, key);
    if (docSnap) {
      const updated = {
        ...product,
        dateModification: formatDate(new Date(), 'dd/MM/yyyy', 'en')
      };
      await updateDoc(docSnap.ref, updated as any);
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
      const docSnap = await this.utilsService.getDocByKey(this.productsRef, product.key);
      if (docSnap) {
        await deleteDoc(docSnap.ref);
      }

      console.log('✅ Produit supprimé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du Produit:', error);
    }
  }
}
