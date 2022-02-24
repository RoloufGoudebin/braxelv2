import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/services/omnicasa/interface';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';
import { OmnicasaService } from 'src/app/services/omnicasa/omnicasa.service';

@Component({
  selector: 'app-top-biens-sell',
  templateUrl: './top-biens-sell.component.html',
  styleUrls: ['./top-biens-sell.component.css', '../../view-property-list/view-property-list.component.css']
})
export class TopBiensSellComponent implements OnInit {

  propertyListSell: Property[];
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
    this.firestore.getFirestoreCollection('sellProperties').subscribe(data =>
      this.propertyListSell = data.map(e => {
        return {
          id: Number(e.payload.doc.id),
          ...e.payload.doc.data() as Property
        }
      }));
  }

  save() {
    this.firestore.savePropertySell(this.propertyListSell);
    setTimeout(() => {
      this.propertyListSell.sort(function (a, b) {
        return a.id - b.id;
      });;
    },
      1500);
  }

  sort(){
    this.propertyListSell.sort(function (a, b) {
      return a.id - b.id;
    });;
    setTimeout(() => {
    },
      3000);
    this.show = true;
  }

  update(newID: number, oldID: number) {
    this.propertyListSell[oldID] = this.propertyListSell[newID];
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
    let tmp = this.propertyListSell[this.toSwap[0]];
    let tmpid = this.propertyListSell[this.toSwap[0]].id;
    let tmpidBis = this.propertyListSell[this.toSwap[1]].id;
    this.propertyListSell[this.toSwap[0]] = this.propertyListSell[this.toSwap[1]];
    this.propertyListSell[this.toSwap[0]].id = tmpid;
    this.propertyListSell[this.toSwap[1]] = tmp;
    this.propertyListSell[this.toSwap[1]].id = tmpidBis;
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
