import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Base } from 'src/app/shared/component/base/base';
import { AppResource } from 'src/app/shared/models/app.resource';
import { AccordionModule } from 'primeng/accordion';

@Component({
    selector: 'app-section-faq',
    templateUrl: './section-faq.component.html',
    standalone: true,
    imports: [CommonModule, AccordionModule]
})
export class SectionFaqComponent extends Base implements OnInit {
  constructor(resources: AppResource) { 
    super(resources);
    console.log(this.resource.faq)
  }

  ngOnInit() {
  }
}
