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
              command: () => this.onView(product.key)
            },
            {
              icon: 'pi pi-pencil',
              label: this.resource.button.edit,
              color: 'p-button-warn',
              command: () => this.onEdit(product.key)
            },
            {
              icon: 'pi pi-trash',
              label: this.resource.button.delete,
              color: 'p-button-danger',
              command: (event?: Event) => this.onDelete(event, product)
            }
          ]
        }))
      )
    );
  }

  onNew() {
    this.router.navigate(['products', 'new']);
  }

  onEdit(key: string) {
    this.router.navigate(['products', 'edit', key]);
  }

  onDelete(event: Event | undefined, product: Product) {
    event?.stopPropagation();
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: this.resource.generic.delete_confirm_m.format(
        this.resource.product.title.toLowerCase(),
        product.title
      ),
      header: this.resource.generic.attention,
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
          severity: severity.info,
          summary: this.resource.generic.confirm,
          detail: this.resource.generic.delete_success_m.format(
            this.resource.product.title.toLowerCase(),
            product.title
          )
        });
      },
      reject: () => {
        this.messageService.add({
          severity: severity.secondary,
          summary: this.resource.generic.cancel,
          detail: this.resource.generic.delete_cancelled
        });
      }
    });
  }

  onView(key: string) {
    this.router.navigate(['products', 'view', key]);
  }

  activeOverlayIndex: number | null = null;

  toggleOverlay(index: number) {
    this.activeOverlayIndex = this.activeOverlayIndex === index ? null : index;
  }
}
