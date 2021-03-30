import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firebase/firestore.service';

import { BraxelHome } from '../braxel-home.model'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private firestore: FirestoreService) { }

  numberProperty = 8 ;
  texts: BraxelHome[];


  ngOnInit() {
    this.firestore.getFirestoreCollection("home").subscribe(data => {
      this.texts = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as BraxelHome }
      })
    });
  }


}
