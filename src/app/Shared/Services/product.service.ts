import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Product } from '../Models/Product.Model';
import * as firebaseStorage from 'firebase/storage';
import { getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Firestore, collectionData, collection, addDoc, where, query, getDocs, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './Utils.service';
import { FileUploadService } from './UploadFile.service';
import { FileUpload } from '../Models/FileUpload.Model';
import { updateDoc } from '@firebase/firestore';
import { set } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private product!: Product;
  private db: any;
  products$!: Observable<Product[]>;
  productsSubject = new Subject<any[]>();

  constructor(private utilsService: UtilsService, private fileUploadService: FileUploadService, private firestore: Firestore) {
    this.db = collection(this.firestore, 'products');
    this.getProducts();
  }

  emitProducts() {
    this.productsSubject.next(this.products.slice());
  }

  /// Get All Products /// OK
  getProducts() {
    this.products$ = collectionData(this.db) as Observable<Product[]>;

    this.products$.subscribe((products: any[]) => {
      this.products = products;
      this.emitProducts();
    }, (error) => {
      console.log(error);
    }, () => {
      console.log('Produits Chargé!');
    });
  }

  /// Get Single Product /// OK
  getProduct(key: string) {
    return new Promise(
      (resolve, reject) => {
        var qry = query(this.db, where("key", "==", key));

        getDocs(qry).then((querySnapshot) => {
          if (querySnapshot) {
            console.log("Document data:", querySnapshot);
            querySnapshot.docs.forEach(element => {
              this.product = element.data() as Product;
            });
            resolve(this.product);
          } else {
            // doc.data() will be undefined in this case
            console.error("No such document!");
            reject("No such document!")
          }
        });
      });
  }

  /// Create Product /// OK
  createNewProduct(newProduct: Product) {
    addDoc(this.db, { key: this.utilsService.getKey(), 
      title: newProduct.title, 
      author: newProduct.author, 
      content: newProduct.content, 
      pictureUrl: newProduct.pictureUrl,
      tagsKey: newProduct.tagsKey });
  }

  updateProduct(product: Product) {
    updateDoc(this.db, { 
      title: product.title, 
      author: product.author, 
      content: product.content, 
      pictureUrl: product.pictureUrl,
      tagsKey: product.tagsKey });
  }

  /// Remove Product + Suppression de l'image /// OK
  removeProduct(product: Product) {
    if (product.pictureUrl) {
      this.fileUploadService.getFileUpload(product.pictureUrl).then((fileUpload) => {
        return this.fileUploadService.deleteFile(fileUpload as FileUpload);
      });
    }

    var qry = query(this.db, where("key", "==", product.key));

    getDocs(qry).then((querySnapshot) => {
      if (querySnapshot) {
        console.log("Document data:", querySnapshot);
      } else {
        // doc.data() will be undefined in this case
        console.error("No such document!");
      }
      querySnapshot.forEach(function (doc) {
        deleteDoc(doc.ref);
      });
    });
  }

  /// Upload File in Storage /// OK
  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        // Create a root reference
        const storage = getStorage();

        // Create a reference to Files
        const almostUniqueFileName = Date.now().toString();
        const upload = firebaseStorage.ref(storage, file.name + '_' + almostUniqueFileName);

        uploadBytes(upload, file).then((data: any) => {
          resolve(getDownloadURL(upload));
          console.log('Chargement…');
        }, (error) => {
          console.log('Erreur de chargement ! : ' + error);
          reject(error);
        });
      }
    );
  }
}