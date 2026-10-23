import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { FAQItem } from 'src/app/resources/resource';

@Component({
  selector: 'app-section-faq',
  templateUrl: './section-faq.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class SectionFaqComponent extends BaseComponent {
  /** Toutes les questions, à plat (les anciens « onglets » sont fusionnés) */
  items: FAQItem[];
  /** Index de la question ouverte (-1 = aucune) */
  open = 0;

  constructor(resources: AppResource) {
    super(resources);
    this.items = ([] as FAQItem[]).concat(...(this.resource.faq.tabs ?? []).map(tab => tab.items ?? []));
  }

  toggle(index: number) {
    this.open = this.open === index ? -1 : index;
  }
}
