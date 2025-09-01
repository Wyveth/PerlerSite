import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/component/breadcrumbs/breadcrumbs.component';
import { Product } from 'src/app/api/models/class/product';
import { ProductService } from 'src/app/api/services/product.service';
import { CommentListComponent } from '../comment-list/comment-list.component';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent, CommentListComponent]
})
export class SingleProductComponent extends BaseComponent implements OnInit {
  product$ = new BehaviorSubject<Product | null>(null);
  key!: string;

  constructor(
    resources: AppResource,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {
    super(resources);
  }

  ngOnInit() {
    this.key = this.route.snapshot.params['id'];
    this.productService.getProduct(this.key).then((product: Product) => {
      // enrichis le product comme tu le fais
      this.product$.next(product);
      product.tagsVisu = product.tagsKey.map(tag => tag['item_text']).join(', ');
    });
  }

  onBack() {
    this.router.navigate([this.resource.router.routes.home]);
  }
}
