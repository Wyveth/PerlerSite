import { SectionFaqComponent } from '../section-faq/section-faq.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SectionWelcomeComponent } from '../section-welcome/section-welcome.component';
import { SectionPortfolioComponent } from '../section-portfolio/section-portfolio.component';
import { SectionContactComponent } from '../section-contact/section-contact.component';
import { SectionSizesComponent } from '../section-sizes/section-sizes.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    CommonModule,
    SectionWelcomeComponent,
    SectionPortfolioComponent,
    SectionSizesComponent,
    SectionFaqComponent,
    SectionContactComponent
  ]
})
export class HomeComponent {}
