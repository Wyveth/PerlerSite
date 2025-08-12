import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { Product } from 'src/app/api/models/class/product';
import { ProductService } from 'src/app/api/services/product.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbsComponent, ButtonModule]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products!: any[];
  productSubscription!: Subscription;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productSubscription = this.productService.productsSubject.subscribe((products: any[]) => {
      this.products = products;
    });
    this.productService.emitProducts();
  }

  ellipsis(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  onNewProduct() {
    this.router.navigate(['/products', 'new']);
  }

  onEditProduct(key: string) {
    this.router.navigate(['/products', 'edit', key]);
  }

  onDeleteProduct(event: Event, product: Product) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Voulez vous vraiment supprimer le produit: ' + product.title,
      header: 'Attention!',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Supprimer',
        severity: 'danger'
      },

      accept: () => {
        this.productService.removeProduct(product);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmation',
          detail: 'Le produit ' + product.title + 'a bien été supprimé'
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'severity',
          summary: 'Annulé',
          detail: 'La demande a bien été annulé'
        });
      }
    });
  }

  onViewProduct(key: string) {
    this.router.navigate(['/products', 'viewA', key]);
  }

  ngOnDestroy() {
    this.productSubscription.unsubscribe();
  }
}
