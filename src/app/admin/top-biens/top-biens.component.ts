import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firebase/firestore.service';
import { Property } from '../../services/omnicasa/interface';
import { OmnicasaService } from '../../services/omnicasa/omnicasa.service'

@Component({
  selector: 'app-top-biens',
  templateUrl: './top-biens.component.html',
  styleUrls: ['./top-biens.component.css', '../../view-property-list/view-property-list.component.css']
})
export class TopBiensComponent implements OnInit {

  topPropertyList: Property[];
  propertyList: Property[];
  newList: Array<Property> = [];
  zip;

  constructor(private firestore: FirestoreService, private omnicasa: OmnicasaService) { }


  ngOnInit(): void {
    this.firestore.getFirestoreCollection("topProperties").subscribe(data => {
      this.topPropertyList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Property
        }
      })
    });
    this.getPropertyList();
  }

  update(newID: number, oldID: number) {
    this.topPropertyList[oldID] = this.topPropertyList[0];
  }

  getPropertyList() {
    this.omnicasa.getPropertyList()
      .subscribe(response => {
        this.propertyList = response.GetPropertyListJsonResult.Value.Items;
        console.log(this.propertyList);
      })
  }

  searchZIP(zip: number) {
    for (let i = 0; i < this.propertyList.length; i++) {
      if (this.propertyList[i].Zip == zip) {
        this.newList.push(this.propertyList[i]);
      }
    }

    this.propertyList = this.newList;
    console.log(this.propertyList);
  }
}


