import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/component/base/base.component';
import { AppResource } from 'src/app/shared/models/app.resource';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-section-faq',
  templateUrl: './section-faq.component.html',
  standalone: true,
  imports: [CommonModule, AccordionModule]
})
export class SectionFaqComponent extends BaseComponent {
  constructor(resources: AppResource) {
    super(resources);
  }
}
