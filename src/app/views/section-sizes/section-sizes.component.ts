import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from 'src/app/api/models/class/product';
import { ProductService } from 'src/app/api/services/product.service';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { formatSize, sizeArea, toMiniSize } from 'src/app/shared/utils/parseSize';

/** Section « Midi ou Mini » : explique la conversion de taille avec un exemple réel */
@Component({
  selector: 'app-section-sizes',
  templateUrl: './section-sizes.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class SectionSizesComponent extends BaseComponent implements OnInit {
  readonly atelierImage = 'assets/img/atelier.webp';

  example: { title: string; midi: string; mini: string } | null = null;

  private destroyRef = inject(DestroyRef);

  constructor(
    resources: AppResource,
    private productService: ProductService
  ) {
    super(resources);
  }

  ngOnInit() {
    this.productService.productsShared$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products: Product[]) => {
        const big = [...products].sort((a, b) => sizeArea(b.size) - sizeArea(a.size))[0];
        this.example = big
          ? {
              title: big.title,
              midi: formatSize(big.size),
              mini: formatSize(toMiniSize(big.size))
            }
          : null;
      });
  }
}
