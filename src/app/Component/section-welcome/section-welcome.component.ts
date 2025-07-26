import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-section-welcome',
    templateUrl: './section-welcome.component.html',
    styleUrls: ['./section-welcome.component.scss'],
    standalone: true,
    imports: [CommonModule, GalleriaModule, CardModule]
})
export class SectionWelcomeComponent implements OnInit {
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

  constructor() { }

  ngOnInit() {
  }

}
