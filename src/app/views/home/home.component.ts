import { SectionResumeComponent } from '../section-resume/section-resume.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SectionWelcomeComponent } from '../section-welcome/section-welcome.component';
import { SectionPortfolioComponent } from '../section-portfolio/section-portfolio.component';
import { SectionContactComponent } from '../section-contact/section-contact.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: true,
    imports: [CommonModule, SectionWelcomeComponent, SectionPortfolioComponent, SectionResumeComponent, SectionContactComponent]
})
export class HomeComponent implements OnInit {
  constructor(private router: Router){
  }

  ngOnInit() {
  }
}

