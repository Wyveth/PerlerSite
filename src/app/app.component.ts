import { Component } from '@angular/core';
import { initializeApp } from "firebase/app";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
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
}
