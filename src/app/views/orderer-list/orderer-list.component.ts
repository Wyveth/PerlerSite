import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-orderer-list',
    templateUrl: './orderer-list.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class OrdererListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
