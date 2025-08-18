import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { Product } from 'src/app/api/models/class/product';
import { ProductService } from 'src/app/api/services/product.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  ImageOverlayComponent,
  OverlayButton
} from 'src/app/shared/component/image-overlay/image-overlay.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { FormatPipe } from 'src/app/shared/pipe/format.pipe';
import { severity } from 'src/app/shared/enum/severity';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbsComponent,
    ButtonModule,
    ImageOverlayComponent,
    FormatPipe
  ]
})
export class ProductListComponent extends BaseComponent {
  productsWithButtons$: Observable<{ product: Product; buttons: OverlayButton[] }[]>;

  constructor(
    resources: AppResource,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private productService: ProductService,
    private router: Router
  ) {
    super(resources);

    this.productsWithButtons$ = this.productService.products$.pipe(
      map(products =>
        products.map(product => ({
          product,
          buttons: [
            {
              icon: 'pi pi-eye',
              label: this.resource.button.view,
              color: 'p-button-info',
              command: () => this.onViewProduct(product.key)
            },
            {
              icon: 'pi pi-pencil',
              label: this.resource.button.edit,
              color: 'p-button-warn',
              command: () => this.onEditProduct(product.key)
            },
            {
              icon: 'pi pi-trash',
              label: this.resource.button.delete,
              color: 'p-button-danger',
              command: (event?: Event) => this.onDeleteProduct(event, product)
            }
          ]
        }))
      )
    );
  }

  ellipsis(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  onNewProduct() {
    this.router.navigate(['products', 'new']);
  }

  onEditProduct(key: string) {
    this.router.navigate(['products', 'edit', key]);
  }

  onDeleteProduct(event: Event | undefined, product: Product) {
    event?.stopPropagation();
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: 'Voulez vous vraiment supprimer le produit: ' + product.title,
      header: 'Attention!',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: this.resource.button.cancel,
      rejectButtonProps: {
        label: this.resource.button.cancel,
        severity: severity.secondary,
        outlined: true
      },
      acceptButtonProps: {
        label: this.resource.button.delete,
        severity: severity.error
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
          severity: 'secondary',
          summary: 'Annulé',
          detail: 'La demande a bien été annulé'
        });
      }
    });
  }

  onViewProduct(key: string) {
    this.router.navigate(['products', 'viewA', key]);
  }

  activeOverlayIndex: number | null = null;

  toggleOverlay(index: number) {
    this.activeOverlayIndex = this.activeOverlayIndex === index ? null : index;
  }
}
