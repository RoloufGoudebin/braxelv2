import { Component, OnInit, HostListener } from '@angular/core';
import { FirestoreService } from '../services/firebase/firestore.service';
import { Property } from '../services/omnicasa/interface';

import { BraxelHome } from '../braxel-home.model'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private firestore: FirestoreService) { }

  numberProperty = 9;
  texts: BraxelHome[];
  showChiffres= false;
  toShow: Property[]


  ngOnInit() {
    this.firestore.getFirestoreCollection('activeProperties').subscribe(data=>
      this.toShow = data.map(e => {
        return {
          id: Number(e.payload.doc.id),
          ...e.payload.doc.data() as Property
        }
    }));
  }

  @HostListener('window:scroll', ['$event'])
  doSomething(event) {

    if(window.pageYOffset > (document.getElementById('chiffres').offsetTop-500)){
      this.showChiffres = true;
    }
  }


}
