import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firebase/firestore.service';
import { Property } from '../services/omnicasa/interface';

@Component({
  selector: 'app-realisations',
  templateUrl: './realisations.component.html',
  styleUrls: ['./realisations.component.css']
})
export class RealisationsComponent implements OnInit {

  constructor(private firestore: FirestoreService) { }

  toShow: Property[]
  numberProperty=12;

  ngOnInit(): void {
    this.firestore.getFirestoreCollection('sellProperties').subscribe(data=>
      this.toShow = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Property
        }
    }));
  }

  addProperties(){
    this.numberProperty = this.numberProperty+9;
  }

}
