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
  ready= false;

  ngOnInit(): void {

    this.firestore.prout.subscribe(data=>
      this.toShow = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Property
        }
    }).filter(e => (e.SubStatus != 2 && e.SubStatus !=3))
    .sort(function (a: Property, b: Property){
      return b.ModifiedSubstatusDate.localeCompare(a.ModifiedSubstatusDate);
    })
    );
    
    this.ready=true;
  }

  addProperties(){
    this.numberProperty = this.numberProperty+9;
  }

  lowerThan(one: number, two: number) {
    return one < two;
  }

}
