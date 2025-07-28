import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { Product } from 'src/app/api/models/class/product';
import { AuthService } from 'src/app/api/services/auth.service';
import { ProductService } from 'src/app/api/services/product.service';
import { TagService } from 'src/app/api/services/tag.service';
import { CommentListComponent } from '../comment-list/comment-list.component';

@Component({
    selector: 'app-single-product',
    templateUrl: './single-product.component.html',
    styleUrls: ['./single-product.component.scss'],
    standalone: true,
    imports: [CommonModule, BreadcrumbsComponent, CommentListComponent]
})
export class SingleProductComponent implements OnInit {
  isAuth!: boolean;
  product!: Product;
  key!: string;
  currentRate = 3.14;

  constructor(private route: ActivatedRoute, private productService: ProductService, private tagService: TagService,
              private router: Router) {}

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
