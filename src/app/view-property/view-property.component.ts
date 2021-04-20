import { Component, OnInit, Input } from '@angular/core';
import { Property, PropertyList } from '../services/omnicasa/interface';
import { ActivatedRoute } from '@angular/router';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service';
import { FirestoreService } from '../services/firebase/firestore.service';

@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.css']
})
export class ViewPropertyComponent implements OnInit {

  propertyList: Property[];
  topPropertyList: Property[];
  property: Property;
  id: number;
  lat: number;
  long: number;

  constructor(private route: ActivatedRoute, public omnicasa: OmnicasaService, private firestore: FirestoreService) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.firestore.getFirestoreCollection('topProperties').subscribe(data => {
      this.topPropertyList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Property
        }
      })
      for (let i = 0; i < this.topPropertyList.length; i++) {
        if (this.topPropertyList[i].ID == this.id) {
          this.property = this.topPropertyList[i];
        }
      }
      this.lat = +this.property.GoogleX;
      this.long = +this.property.GoogleY;
    });



  }

  toStringPrice(price: number){
    let toChange = price.toString();
    return toChange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  }


}

