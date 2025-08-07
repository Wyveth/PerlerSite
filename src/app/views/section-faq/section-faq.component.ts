import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-section-faq',
    templateUrl: './section-faq.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class SectionFaqComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
