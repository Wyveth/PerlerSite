import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from 'src/app/shared/component/header/header.component';
import { FooterComponent } from 'src/app/shared/component/footer/footer.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet, ScrollTopModule, ButtonModule]
})
export class LayoutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
