import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app3';

  ngOnInit(): void{
    let firebaseConfig = {
      apiKey: "AIzaSyAI580oBd4sG10lQXp8tbm99A0_EeXyOf4",
      authDomain: "instagramclone-angular.firebaseapp.com",
      databaseURL: "https://instagramclone-angular.firebaseio.com",
      projectId: "instagramclone-angular",
      storageBucket: "instagramclone-angular.appspot.com",
      messagingSenderId: "771784086036",
      appId: "1:771784086036:web:3ebd958a814190565bcd01"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

}
