import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/Shared/Models/Product.Model';
import { ProductService } from 'src/app/Shared/Services/product.service';
import { TagService } from 'src/app/Shared/Services/tag.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products!: any[];
  productSubscription!: Subscription;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit() {
    this.productSubscription = this.productService.productsSubject.subscribe(
      (products: any[]) => {
        this.products = products;
      }
    );
    this.productService.emitProducts();
  }

  onNewProduct() {
    this.router.navigate(['/products', 'new']);
  }

  onEditProduct(key: string) {
    this.router.navigate(['/products', 'edit', key]);
  }

  onDeleteProduct(product: Product) {
    this.productService.removeProduct(product);
  }

  onViewProduct(key: string) {
    this.router.navigate(['/products', 'view', key]);
  }

  ngOnDestroy() {
    this.productSubscription.unsubscribe();
  }
}
