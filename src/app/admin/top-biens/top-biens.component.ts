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
  toSwap= [-1,-1];
  zip: number;
  priceMin: number;
  priceMax: number;
  priceExact: number;
  propertyListToChange: number;
  show= false;


  constructor(private firestore: FirestoreService, private omnicasa: OmnicasaService) { }


  ngOnInit(): void {
    this.firestore.getFirestoreCollection('activeProperties').subscribe(data =>
      this.topPropertyList = data.map(e => {
        return {
          id: Number(e.payload.doc.id),
          ...e.payload.doc.data() as Property
        }
      }));
  }

  save() {
    this.firestore.savePropertyTop(this.topPropertyList);
    setTimeout(() => {
      this.topPropertyList.sort(function (a, b) {
        return a.id - b.id;
      });;
    },
      1500);
  }

  sort(){
    this.topPropertyList.sort(function (a, b) {
      return a.id - b.id;
    });;
    setTimeout(() => {
    },
      3000);
    this.show = true;
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
  selectSwap(id: number) {
    if (this.toSwap[0] == -1) {
      this.toSwap[0] = id;
    }
    else if (this.toSwap[1] == -1){
      this.toSwap[1] = id;
    }
    else if (this.toSwap[0] != -1 && this.toSwap[1] != -1){
      this.toSwap[0] = -1;
      this.toSwap[1] = -1;
    }
  }

  selectPropertyListToChange(id: number) {
    this.propertyListToChange = id;
  }

  swap() {
    let tmp = this.topPropertyList[this.toSwap[0]];
    let tmpid = this.topPropertyList[this.toSwap[0]].id;
    let tmpidBis = this.topPropertyList[this.toSwap[1]].id;
    this.topPropertyList[this.toSwap[0]] = this.topPropertyList[this.toSwap[1]];
    this.topPropertyList[this.toSwap[0]].id = tmpid;
    this.topPropertyList[this.toSwap[1]] = tmp;
    this.topPropertyList[this.toSwap[1]].id = tmpidBis;
    this.toSwap[0] = -1;
    this.toSwap[1] = -1;
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
      if (this.propertyList[i].Price == max) {
        this.propertyList[j] = this.propertyList[i];
        j++;
      }
    }
    this.propertyList.splice(j, this.propertyList.length - j);
  }


}