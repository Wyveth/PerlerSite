import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import imagesLoaded from 'imagesloaded';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/api/models/class/product';
import { Tag } from 'src/app/api/models/class/tag';
import { ProductService } from 'src/app/api/services/product.service';
import { TagService } from 'src/app/api/services/tag.service';
import { ImageModule } from 'primeng/image';
import { Base } from 'src/app/shared/component/base/base';
import { AppResource } from 'src/app/shared/models/app.resource';
import { FormatPipe } from 'src/app/shared/pipe/format.pipe';

@Component({
    selector: 'app-section-portfolio',
    templateUrl: './section-portfolio.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule, ImageModule, FormatPipe]
})
export class SectionPortfolioComponent extends Base implements OnInit, OnDestroy {
  products!: Product[];
  productSubscription!: Subscription;

  tags!: Tag[];
  tagSubscription!: Subscription;

  class!: string;
  activeFilter: string = '*';

  constructor(resources: AppResource, private productService: ProductService, private tagService: TagService) {
    super(resources);
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
  }

  ngOnInit() {
    this.tagSubscription = this.tagService.tagsSubject.subscribe(
      (tags: Tag[]) => {
        this.tags = tags;
      }
    );
    this.tagService.emitTags();

    this.productSubscription = this.productService.productsSubject.subscribe(
      (products: Product[]) => {
        this.products = products
          .sort((a, b) => a.title.localeCompare(b.title))
          .map(product => {
            const isNew = this.isNew(product.dateCreation);
            const filterClasses = product.tagsKey
              .map(t => 'filter-' + t.item_text)
              .join(' ');
            return { ...product, isNew, filterClasses };
          });

          setTimeout(() => {
            const grid = document.querySelector('#portfolio-container');
            if (grid) {
              imagesLoaded(grid, () => {
                this.loadJsFile('assets/js/isotope.js');
              });
            }
          }, 0);
      }
  );

  this.productService.emitProducts();
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
  
  public loadJsFile(url: string) {  
    let node = document.createElement('script');  
    node.src = url;  
    node.type = 'text/javascript';  
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  ngOnDestroy() {
    if (this.tagSubscription) {
      this.tagSubscription.unsubscribe();
    }
  }
}