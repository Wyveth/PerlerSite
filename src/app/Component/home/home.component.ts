import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router){}

  ngOnInit() {
    this.loadJsFile("assets/vendor/glightbox/js/glightbox.min.js");
    this.loadJsFile("assets/vendor/isotope-layout/isotope.pkgd.min.js");
    this.loadJsFile("assets/vendor/swiper/swiper-bundle.min.js");
    this.loadJsFile("assets/vendor/typed.js/typed.min.js");
    this.loadJsFile("assets/vendor/waypoints/noframework.waypoints.js");
    this.loadJsFile("assets/js/main.js");
  }
  
  public loadJsFile(url: string) {  
    let node = document.createElement('script');  
    node.src = url;  
    node.type = 'text/javascript';  
    document.getElementsByTagName('head')[0].appendChild(node);
  }  
}
