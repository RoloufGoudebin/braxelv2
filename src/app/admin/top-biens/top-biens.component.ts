import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firebase/firestore.service';
import { Property } from '../../services/omnicasa/interface';
import { OmnicasaService } from '../../services/omnicasa/omnicasa.service'
import { NgbPaginationNumber } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-top-biens',
  templateUrl: './top-biens.component.html',
  styleUrls: ['./top-biens.component.css', '../../view-property-list/view-property-list.component.css']
})
export class TopBiensComponent implements OnInit {

  topPropertyList: Property[];
  propertyList: Property[];
  newList: Array<Property> = [];
  listTemp: Array<Property> = [];
  topToChange: number;
  zip: number;
  priceMin: number;
  priceMax: number;
  priceExact: number;
  propertyListToChange: number;


  constructor(private firestore: FirestoreService, private omnicasa: OmnicasaService) { }


  ngOnInit(): void {
    this.getPropertyList();
    this.firestore.getFirestoreCollection('activeProperties').subscribe(data=>
      this.topPropertyList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Property
        }
    }));
  }

  save(){
    console.log(this.topPropertyList);
    this.firestore.savePropertyTop(this.topPropertyList);
  }

  update(newID: number, oldID: number) {
    this.topPropertyList[oldID] = this.topPropertyList[newID];
  }

  getPropertyList() {
    this.omnicasa.getPropertyList()
      .subscribe(response => {
        this.propertyList = response.GetPropertyListJsonResult.Value.Items;
      })
  }

  searchZIP(zip: number) {
    let j = 0;
    for (let i = 0; i < this.propertyList.length; i++) {
      if (this.propertyList[i].Zip == zip) {
        this.propertyList[j] = this.propertyList[i];
        j++;
      }
    }
    this.propertyList.splice(j, this.propertyList.length - j);
  }

  searchMaxPrice(max: number) {
    let j = 0;
    for (let i = 0; i < this.propertyList.length; i++) {
      if (this.propertyList[i].StartPrice > max) {
        this.propertyList[j] = this.propertyList[i];
        j++
      }
    }
    this.propertyList.splice(j, this.propertyList.length - j);
  }

  searchMinPrice(min: number) {
    let j = 0;
    for (let i = 0; i < this.propertyList.length; i++) {
      if (this.propertyList[i].StartPrice > min) {
        this.propertyList[j] = this.propertyList[i];
        j++
      }
    }
    this.propertyList.splice(j, this.propertyList.length - j);
  }

  searchExactPrice(max: number) {
    let j = 0;
    for (let i = 0; i < this.propertyList.length; i++) {
      console.log(this.propertyList[i].Price);
      if (this.propertyList[i].Price == max) {
        this.propertyList[j] = this.propertyList[i];
        console.log(this.propertyList[i]);
        j++;
      }
    }
    this.propertyList.splice(j, this.propertyList.length - j);
  }

  selectTop(id: number){
    this.topToChange = id;
  }

  selectPropertyListToChange(id: number){
    this.propertyListToChange = id;
  }
  
  changeProperty(){
    this.topPropertyList[this.topToChange] = this.propertyList[this.propertyListToChange];
  }



}