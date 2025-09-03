import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { CardModule } from 'primeng/card';
import { AppResource } from 'src/app/shared/models/app.resource';
import { BaseComponent } from 'src/app/shared/component/base/base.component';

@Component({
  selector: 'app-section-welcome',
  templateUrl: './section-welcome.component.html',
  standalone: true,
  imports: [CommonModule, GalleriaModule, CardModule]
})
export class SectionWelcomeComponent extends BaseComponent implements OnInit {
  images: string[] = [
    'assets/img/Perles-Atelier.jpg',
    'assets/img/PokemonGen1.jpg',
    'assets/img/Justice_League.jpg',
    'assets/img/Pokemon_Starter.jpg'
  ];

  responsiveOptions: any[] = [
    {
      breakpoint: '991px',
      numVisible: 4
    },
    {
      breakpoint: '767px',
      numVisible: 3
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];

  constructor(resources: AppResource) {
    super(resources);
  }

  ngOnInit() {}
}
