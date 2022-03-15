import { Component, OnInit, HostListener } from '@angular/core';
import { FirestoreService } from '../services/firebase/firestore.service';
import { Property } from '../services/omnicasa/interface';

import { BraxelHome } from '../braxel-home.model'
import { TranslateService } from '@ngx-translate/core';
import e from 'express';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private firestore: FirestoreService) {
   }

  numberProperty = 9;
  texts: BraxelHome[];
  showChiffres= false;
  toShow: Property[]


  ngOnInit() {
    this.firestore.prout.subscribe(data=>
      this.toShow = data.map(e => {
        return {
          id: Number(e.payload.doc.id),
          ...e.payload.doc.data() as Property
        }
    }).filter(e => (e.SubStatus == 2 || e.SubStatus == 3))
    .sort(function (a: Property, b: Property){
      return b.id - a.id;
    })
    );
  }

  @HostListener('window:scroll', ['$event'])
  doSomething(event: any) {

    if(window.pageYOffset > (document.getElementById('chiffres').offsetTop-500)){
      this.showChiffres = true;
    }
  }


}
