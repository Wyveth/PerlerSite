import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { combineLatest } from 'rxjs';
import { KeyValue, Product } from 'src/app/api/models/class/product';
import { Tag } from 'src/app/api/models/class/tag';
import { ProductService } from 'src/app/api/services/product.service';
import { TagService } from 'src/app/api/services/tag.service';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { FormatPipe } from 'src/app/shared/pipe/format.pipe';
import { firstPicture } from 'src/app/shared/utils/picture';
import { formatSize, toMiniSize } from 'src/app/shared/utils/parseSize';

/** Pièce prête à l'affichage dans la galerie */
export interface GalleryItem {
  key: string;
  title: string;
  picture: string;
  tagCodes: string[];
  tagLabel: string;
  midi: string;
  mini: string;
  isNew: boolean;
}

@Component({
  selector: 'app-section-portfolio',
  templateUrl: './section-portfolio.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormatPipe]
})
export class SectionPortfolioComponent extends BaseComponent implements OnInit {
  readonly pageSize = 12;

  /** Toutes les pièces, triées par titre */
  items = signal<GalleryItem[]>([]);
  tags = signal<Tag[]>([]);

  activeTag = signal<string>('*');
  search = signal<string>('');
  limit = signal<number>(this.pageSize);

  /** Pièces correspondant au filtre et à la recherche */
  filtered = computed(() => {
    const tag = this.activeTag();
    const term = normalize(this.search());
    return this.items().filter(
      item =>
        (tag === '*' || item.tagCodes.includes(tag)) &&
        (!term || normalize(item.title).includes(term))
    );
  });

  /** Pièces réellement affichées (pagination « Afficher plus ») */
  visible = computed(() => this.filtered().slice(0, this.limit()));

  private destroyRef = inject(DestroyRef);

  constructor(
    resources: AppResource,
    private productService: ProductService,
    private tagService: TagService
  ) {
    super(resources);
  }

  ngOnInit() {
    combineLatest([this.productService.productsShared$, this.tagService.tags$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([products, tags]: [Product[], Tag[]]) => {
        const labels = new Map(tags.map(t => [t.code, t.libelle]));
        this.tags.set([...tags].sort((a, b) => a.libelle.localeCompare(b.libelle)));
        this.items.set(
          [...products]
            .sort((a, b) => a.title.localeCompare(b.title))
            .map(product => {
              const codes = (product.tagsKey ?? []).map((t: KeyValue) => t.item_text);
              return {
                key: product.key,
                title: product.title,
                picture: firstPicture(product.pictureUrl),
                tagCodes: codes,
                tagLabel: codes.map(c => labels.get(c) ?? c).join(', '),
                midi: formatSize(product.size),
                mini: formatSize(toMiniSize(product.size)),
                isNew: this.isNew(product.dateCreation)
              };
            })
        );
      });
  }

  setActiveTag(code: string) {
    this.activeTag.set(code);
    this.limit.set(this.pageSize);
  }

  onSearch(value: string) {
    this.search.set(value);
    this.limit.set(this.pageSize);
  }

  showMore() {
    this.limit.update(l => l + this.pageSize);
  }

  /** Détermine si un produit est « nouveau » (créé il y a moins d'un mois) */
  isNew(dateCreationStr: string): boolean {
    if (!dateCreationStr) return false;
    const [day, month, year] = dateCreationStr.split('/').map(Number);
    const newUntil = new Date(year, month - 1, day);
    newUntil.setMonth(newUntil.getMonth() + 1);
    return new Date() <= newUntil;
  }
}

/** Recherche insensible à la casse et aux accents */
function normalize(value: string): string {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
