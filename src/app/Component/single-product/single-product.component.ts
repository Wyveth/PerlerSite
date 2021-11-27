import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/Shared/Models/Product.Model';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { ProductService } from 'src/app/Shared/Services/product.service';
import { TagService } from 'src/app/Shared/Services/tag.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit {
  isAuth!: boolean;
  product!: Product;
  key!: string;
  currentRate = 3.14;

  constructor(private route: ActivatedRoute, private productService: ProductService, private tagService: TagService,
              private router: Router, private authService: AuthService) {}

  ngOnInit() {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    );
    
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
        })
        ;
      }
    );
  }

  onBack() {
    this.router.navigate(['/home']);
  }
}
