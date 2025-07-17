import { Component, OnInit, TemplateRef } from '@angular/core';
import { initializeApp } from "firebase/app";
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})

export class AppComponent implements OnInit {
  constructor() {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyCtUz6VvXBUAhQjwM_ehArQQOSpgUaThnc",
      authDomain: "perlerwyveth.firebaseapp.com",
      projectId: "perlerwyveth",
      storageBucket: "perlerwyveth.appspot.com",
      messagingSenderId: "707528245165",
      appId: "1:707528245165:web:33dd8eb0d6d2a50207eb24",
      measurementId: "G-NXZRD0EQ7C"
    };

    // Initialize Firebase
    const app = initializeApp(environment.firebase);
    //const analytics = getAnalytics(app);
  }

  ngOnInit() {
    this.loadJsFile("assets/js/main.js");
  }
  
  public loadJsFile(url: string) {  
    let node = document.createElement('script');  
    node.src = url;  
    node.type = 'text/javascript';  
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}
