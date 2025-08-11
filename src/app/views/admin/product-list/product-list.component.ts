import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { Product } from 'src/app/api/models/class/product';
import { ProductService } from 'src/app/api/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbsComponent],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products!: any[];
  productSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productSubscription = this.productService.productsSubject.subscribe((products: any[]) => {
      this.products = products;
    });
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
    this.router.navigate(['/products', 'viewA', key]);
  }

  ngOnDestroy() {
    this.productSubscription.unsubscribe();
  }
}
