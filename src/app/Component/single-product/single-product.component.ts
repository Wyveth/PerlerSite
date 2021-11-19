import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/Shared/Models/Product.Model';
import { ProductService } from 'src/app/Shared/Services/product.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit {
  product!: Product;
  key!: string;

  constructor(private route: ActivatedRoute, private productService: ProductService,
              private router: Router) {}

  ngOnInit() {
    this.product = new Product('','','','','','','');
    this.key = this.route.snapshot.params['id'];
    this.productService.getProduct(this.key).then(
      (product: any) => {
        this.product = product;
      }
    );
  }

  onBack() {
    this.router.navigate(['/products']);
  }

}
