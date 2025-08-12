import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, ConfirmDialog]
})
export class AppComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    //this.loadJsFile("assets/js/main.js");
  }

  public loadJsFile(url: string) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}
