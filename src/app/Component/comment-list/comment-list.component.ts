import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-comment-list',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class CommentListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
