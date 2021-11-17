import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/Shared/Services/product.service';
import { TagService } from 'src/app/Shared/Services/tag.service';

@Component({
  selector: 'app-section-portfolio',
  templateUrl: './section-portfolio.component.html',
  styleUrls: ['./section-portfolio.component.scss']
})
export class SectionPortfolioComponent implements OnInit {
  products!: any[];
  productSubscription!: Subscription;

  tags!: any[];
  tagSubscription!: Subscription;

  constructor(private productService: ProductService, private tagService: TagService) {
    this.tagSubscription = this.tagService.tagsSubject.subscribe(
      (tags: any[]) => {
        this.tags = tags;
        this.tags.forEach(tag => {
          let node = document.createElement('li');
          let classFilter = '.filter-' + tag.code;
          node.setAttribute("data-filter", classFilter);
          node.textContent = tag.libelle;
          document.getElementById('portfolio-flters')?.append(node);
        })
        this.loadJsFile("assets/js/isotope.js");
      }
    );
    this.tagService.emitTags();
  }

  ngOnInit() {
    this.productSubscription = this.productService.productsSubject.subscribe(
      (products: any[]) => {
        this.products = products;
      }
    );
    this.productService.emitProducts();
  }
  
  public loadJsFile(url: string) {  
    let node = document.createElement('script');  
    node.src = url;  
    node.type = 'text/javascript';  
    document.getElementsByTagName('head')[0].appendChild(node);
  }  
}
