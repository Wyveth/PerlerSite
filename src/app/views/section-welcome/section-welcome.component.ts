import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Product } from 'src/app/api/models/class/product';
import { Tag } from 'src/app/api/models/class/tag';
import { ProductService } from 'src/app/api/services/product.service';
import { TagService } from 'src/app/api/services/tag.service';
import { BaseComponent } from 'src/app/Shared/Component/base/base.component';
import { scrollViewFragment } from 'src/app/Shared/Component/header/header.component';
import { AppResource } from 'src/app/Shared/Models/app.resource';
import { firstPicture } from 'src/app/Shared/utils/picture';
import { formatSize, sizeArea } from 'src/app/Shared/utils/parseSize';

@Component({
  selector: 'app-section-welcome',
  templateUrl: './section-welcome.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class SectionWelcomeComponent extends BaseComponent implements OnInit {
  readonly heroImage = 'assets/img/hero-pokemon-gen1.webp';

  productCount: number | null = null;
  universeCount: number | null = null;
  biggest: { title: string; size: string; picture: string } | null = null;

  private destroyRef = inject(DestroyRef);

  constructor(
    resources: AppResource,
    private productService: ProductService,
    private tagService: TagService,
    private router: Router
  ) {
    super(resources);
  }

  ngOnInit() {
    combineLatest([this.productService.productsShared$, this.tagService.tags$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([products, tags]: [Product[], Tag[]]) => {
        this.productCount = products.length;
        this.universeCount = tags.length;

        const big = [...products].sort((a, b) => sizeArea(b.size) - sizeArea(a.size))[0];
        this.biggest = big
          ? { title: big.title, size: formatSize(big.size), picture: firstPicture(big.pictureUrl) }
          : null;
      });
  }

  goTo(fragment: string) {
    scrollViewFragment(this.router, fragment);
  }
}
