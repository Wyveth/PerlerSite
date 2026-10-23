import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest, from, of, switchMap, catchError, map } from 'rxjs';
import { KeyValue, Product } from 'src/app/api/models/class/product';
import { Tag } from 'src/app/api/models/class/tag';
import { ProductService } from 'src/app/api/services/product.service';
import { TagService } from 'src/app/api/services/tag.service';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { scrollViewFragment } from 'src/app/shared/component/header/header.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { FormatPipe } from 'src/app/shared/pipe/format.pipe';
import { allPictures, firstPicture } from 'src/app/shared/utils/picture';
import { AvailabilityStatus, hasAvailability, sizeAvailability } from 'src/app/shared/utils/availability';
import { formatSize, toMiniSize } from 'src/app/shared/utils/parseSize';

type Bead = 'mini' | 'midi';

interface AvailabilityRow {
  bead: Bead;
  label: string;
  status: AvailabilityStatus;
  text: string;
}

interface RelatedItem {
  key: string;
  title: string;
  picture: string;
  mini: string;
  midi: string;
}

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormatPipe]
})
export class SingleProductComponent extends BaseComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  notFound = false;

  pictures: string[] = [];
  selectedPicture = 0;

  tagLabels: string[] = [];
  midi = '';
  mini = '';
  bead: Bead = 'mini';

  related: RelatedItem[] = [];
  /** Disponibilité Mini / Midi (vide si jamais renseignée dans l'admin) */
  availability: AvailabilityRow[] = [];

  private destroyRef = inject(DestroyRef);

  constructor(
    resources: AppResource,
    private route: ActivatedRoute,
    private productService: ProductService,
    private tagService: TagService,
    private router: Router
  ) {
    super(resources);
  }

  ngOnInit() {
    // On écoute les changements de paramètre : un clic sur une pièce liée recharge bien la page
    this.route.paramMap
      .pipe(
        map(params => params.get('id') ?? ''),
        switchMap(key => {
          this.loading = true;
          this.notFound = false;
          this.bead = 'mini';
          window.scrollTo({ top: 0 });
          return combineLatest([
            from(this.productService.getProduct(key)).pipe(catchError(() => of(null))),
            this.productService.productsShared$,
            this.tagService.tags$
          ]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([product, products, tags]: [Product | null, Product[], Tag[]]) => {
        this.loading = false;
        this.product = product;
        if (!product) {
          this.notFound = true;
          return;
        }

        const labels = new Map(tags.map(t => [t.code, t.libelle]));
        const codes = (product.tagsKey ?? []).map((t: KeyValue) => t.item_text);

        this.pictures = allPictures(product.pictureUrl);
        this.selectedPicture = 0;
        this.tagLabels = codes.map(c => labels.get(c) ?? c);
        this.midi = formatSize(product.size);
        this.mini = formatSize(toMiniSize(product.size));
        this.availability = hasAvailability(product)
          ? [
              this.availabilityRow('mini', this.resource.home.mini, product.stockMini, product.onDemandMini),
              this.availabilityRow('midi', this.resource.home.midi, product.stockMidi, product.onDemandMidi)
            ]
          : [];

        this.related = products
          .filter(
            p =>
              p.key !== product.key &&
              (p.tagsKey ?? []).some((t: KeyValue) => codes.includes(t.item_text))
          )
          .slice(0, 4)
          .map(p => ({
            key: p.key,
            title: p.title,
            picture: firstPicture(p.pictureUrl),
            mini: formatSize(toMiniSize(p.size)),
            midi: formatSize(p.size)
          }));
      });
  }

  private availabilityRow(
    bead: Bead,
    label: string,
    stock: number | undefined,
    onDemand: boolean | undefined
  ): AvailabilityRow {
    const { status, quantity } = sizeAvailability(stock, onDemand);
    const page = this.resource.product_page;
    const text =
      status === 'stock'
        ? quantity === 1
          ? page.stock_one
          : page.stock_many.format(quantity)
        : status === 'demand'
          ? page.on_demand
          : page.unavailable;
    return { bead, label, status, text };
  }

  get currentSize(): string {
    return this.bead === 'mini' ? this.mini : this.midi;
  }

  setBead(bead: Bead) {
    this.bead = bead;
  }

  askQuestion() {
    scrollViewFragment(this.router, this.resource.router.routes.contact);
  }

  backToGallery() {
    scrollViewFragment(this.router, this.resource.router.routes.achievements);
  }
}
