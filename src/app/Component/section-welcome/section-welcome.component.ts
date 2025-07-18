import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-section-welcome',
    templateUrl: './section-welcome.component.html',
    styleUrls: ['./section-welcome.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class SectionWelcomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
