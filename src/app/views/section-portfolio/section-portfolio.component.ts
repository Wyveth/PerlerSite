import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/api/models/class/product';
import { ProductService } from 'src/app/api/services/product.service';
import { TagService } from 'src/app/api/services/tag.service';

@Component({
    selector: 'app-section-portfolio',
    templateUrl: './section-portfolio.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class SectionPortfolioComponent implements OnInit {
  products!: any[];
  productSubscription!: Subscription;

  tags!: any[];
  tagSubscription!: Subscription;

  class!: string;

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
      }
    );
    this.tagService.emitTags();
  }

  ngOnInit() {
    this.productSubscription = this.productService.productsSubject.subscribe(
      (products: any[]) => {
        this.products = products.sort((a,b) => a.title.localeCompare(b.title));
        
        this.products.forEach((product: Product) => {
        //Creation Icon Plus
        let i_plus = document.createElement('i');
        i_plus.setAttribute("class", "bi bi-plus");

        //Creation A href
        let a_href_img = document.createElement('a');
        a_href_img.setAttribute("href", product.pictureUrl);
        a_href_img.setAttribute("data-gallery", "portfolioGallery");
        a_href_img.setAttribute("class", "portfokio-lightbox");
        a_href_img.setAttribute("title", product.title);

        a_href_img.append(i_plus);

        //Creation Icon Lien
        let i_lien = document.createElement('i');
        i_lien.setAttribute("class", "bi bi-link");

        let a_href_redirect = document.createElement('a');
        a_href_redirect.setAttribute("href", "products/view/" + product.key);
        a_href_redirect.setAttribute("title", "Détails");

        a_href_redirect.append(i_lien);

        let div_link = document.createElement('div');
        div_link.setAttribute("class", "portfolio-links");

        div_link.append(a_href_img, a_href_redirect);

        let div_title = document.createElement('div');
        
        var dateToday = new Date();

        var dateCreation = product.dateCreation.split('/');
        var month = Number(dateCreation[1]);

        var myCurrentDate = new Date(dateCreation[1] + "/" + dateCreation[0] + "/" + dateCreation[2]);
        var myFutureDate = new Date(myCurrentDate);
        myFutureDate.setMonth(month);

        let spanNew = document.createElement('span');
        spanNew.textContent = "New";
        spanNew.setAttribute("class", "spanNew");

        let h4 = document.createElement("h4");
        h4.textContent = product.title;
        h4.setAttribute("style", "margin-top: 20px;");

        if(myFutureDate > dateToday){
          div_title.append(spanNew, h4);
        }
        else{
          div_title.append(h4);
        }
        
        let p = document.createElement('p');
        p.textContent = product.size + " cm";

        let div_info = document.createElement('div');
        div_info.setAttribute("class", "portfolio-info");

        div_info.append(div_title, p, div_link);

        let img = document.createElement('img');
        img.setAttribute("src", product.pictureUrl);
        img.setAttribute("class", "img-fluid");
        img.setAttribute("alt", product.content);

        let div_wrap = document.createElement('div');
        div_wrap.setAttribute("class", "portfolio-wrap");

        div_wrap.append(img, div_info);

        this.class = "";
        product.tagsKey.forEach((element: any) => {
          this.class= " filter-" + element['item_text'] + " ";
        });

        let div_item = document.createElement('div');
        div_item.setAttribute("class", "col-lg-4 col-md-6 portfolio-item" + this.class);

        div_item.append(div_wrap);

        document.getElementById('portfolio-container')?.append(div_item);
        });

        setTimeout(() => {
          this.loadJsFile("assets/js/isotope.js");
        }, 1000);
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
