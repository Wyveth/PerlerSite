import { CommonModule } from '@angular/common';
import {
  Component,
  EnvironmentInjector,
  OnDestroy,
  OnInit,
  afterNextRender,
  effect,
  inject,
  runInInjectionContext,
  signal
} from '@angular/core';
import { RouterModule } from '@angular/router';
import imagesLoaded from 'imagesloaded';
import { Subscription } from 'rxjs';
import { Product, KeyValue } from 'src/app/api/models/class/product';
import { Tag } from 'src/app/api/models/class/tag';
import { ProductService } from 'src/app/api/services/product.service';
import { TagService } from 'src/app/api/services/tag.service';
import { ImageModule } from 'primeng/image';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { FormatPipe } from 'src/app/shared/pipe/format.pipe';

@Component({
  selector: 'app-section-portfolio',
  templateUrl: './section-portfolio.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageModule, FormatPipe]
})
export class SectionPortfolioComponent extends BaseComponent implements OnInit, OnDestroy {
  products = signal<Product[]>([]);
  productSubscription!: Subscription;

  tags!: Tag[];
  tagSubscription!: Subscription;

  class!: string;
  activeFilter: string = '*';

  private isotope: any;
  private injector = inject(EnvironmentInjector);

  constructor(
    resources: AppResource,
    private productService: ProductService,
    private tagService: TagService
  ) {
    super(resources);

    // Quand products change → on initialise Isotope
    effect(() => {
      const list = this.products();
      if (!list.length) return;

      runInInjectionContext(this.injector, () => {
        afterNextRender(async () => {
          const grid = document.querySelector('#portfolio-container') as HTMLElement; // Ajout du cast vers HTMLElement
          if (!grid) return;

          imagesLoaded(grid, async () => {
            const IsotopeModule = await import('isotope-layout');
            const Isotope = IsotopeModule.default;
            this.isotope = new Isotope(grid, {
              itemSelector: '.portfolio-item',
              percentPosition: true,
              masonry: { columnWidth: '.portfolio-item' } // ou layoutMode: 'fitRows'
            });
          });
        });
      });
    });
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;

    if (this.isotope) {
      this.isotope.arrange({ filter });
    }
  }

  ngOnInit() {
    this.tagSubscription = this.tagService.tags$.subscribe((tags: Tag[]) => {
      this.tags = tags;
    });

    this.productService.products$.subscribe((products: Product[]) => {
      // BEGIN:
      this.products.set(
        // Changement ici pour appeler la méthode set de signal
        products
          .sort((a, b) => a.title.localeCompare(b.title))
          .map(product => {
            const isNew = this.isNew(product.dateCreation);
            const filterClasses = product.tagsKey
              .map((t: KeyValue) => 'filter-' + t.item_text) // Changement ici pour utiliser 'libelle' de TagKey
              .join(' ');
            return { ...product, isNew, filterClasses };
          })
      );
    }); // END:
  }

  // Détermine si un produit est "New"
  isNew(dateCreationStr: string): boolean {
    const today = new Date();
    const [day, month, year] = dateCreationStr.split('/').map(Number);
    const creationDate = new Date(year, month - 1, day);
    const newUntil = new Date(creationDate);
    newUntil.setMonth(newUntil.getMonth() + 1); // Produit "new" pendant 1 mois

    return today <= newUntil;
  }

  ngOnDestroy() {
    if (this.tagSubscription) {
      this.tagSubscription.unsubscribe();
    }
  }
}
