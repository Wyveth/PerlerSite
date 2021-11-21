import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/Shared/Models/Product.Model';
import { ProductService } from 'src/app/Shared/Services/product.service';
import { TagService } from 'src/app/Shared/Services/tag.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit {
  product!: Product;
  key!: string;

  constructor(private route: ActivatedRoute, private productService: ProductService, private tagService: TagService,
              private router: Router) {}

  ngOnInit() {
    this.product = new Product('','','','','','','');
    this.key = this.route.snapshot.params['id'];
    this.productService.getProduct(this.key).then(
      (product: any) => {
        this.product = product;
        let count = this.product.tagsKey.length;
        let countGo = 0;
        this.product.tagsVisu = "";

        this.product.tagsKey.forEach((tag : any) => {
          countGo++;
          if(countGo == count)
              this.product.tagsVisu = this.product.tagsVisu + tag['item_text'];
            else
              this.product.tagsVisu = this.product.tagsVisu + tag['item_text'] + ", ";

          /*this.tagService.getTag(tag['item.id']).then((tagObj: any) =>{
            if(countGo == count)
              this.product.tagsVisu = tagObj.libelle;
            else
              this.product.tagsVisu = tagObj.libelle = ", ";
          });*/
        })
        ;
      }
    );
  }

  onBack() {
    this.router.navigate(['/home']);
  }
}
