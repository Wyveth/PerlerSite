import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  @Input() nodeParent = "";
  @Input() nodeParentUrl = "";
  @Input() nodeChild = "";
  @Input() nodeChildUrl = "";
  @Input() nodeChildChild = "";
  @Input() nodeChildChildUrl = "";
  
  constructor() { }

  ngOnInit() {
  }

}
