import { FocusTrapManager } from '@angular/cdk/a11y/focus-trap/focus-trap-manager';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Listener } from 'selenium-webdriver';
import { Property, PropertyList } from '../omnicasa/interface';
import { OmnicasaService } from '../omnicasa/omnicasa.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore, private omnicasaService: OmnicasaService) { }

  propertyList: Property[];
  propertyListTop: Property[];
  collection: any;
  topPropertyList: Property[];





  getFirestoreCollection(collection) {
    return this.firestore.collection(collection).snapshotChanges();
  }

  savePropertyTop(newTopPropertyList: Property[]) {
    this.propertyListTop = newTopPropertyList;
    for (let i = 0; i < this.propertyListTop.length; i++) {
      this.firestore
        .collection("activeProperties")
        .doc(i.toString())
        .set(newTopPropertyList[i])
    }
  }


  searchProperty(goal: number, status: number, type: number[], zip: number, minRoom: number, maxRoom: number, minPrice: number, maxPrice: number) {
    var toReturn: Property[];
    toReturn = [];
    for (let i = this.topPropertyList.length - 1; i >= 0; i--) {
      if (this.topPropertyList[i].Goal == goal && this.topPropertyList[i].SubStatus == status) {
        for (let j = 0; j < type.length; j++) {
          if (type[j] == this.topPropertyList[i].WebID) {
            if (this.topPropertyList[i].Zip == zip) {
              if (this.topPropertyList[i].NumberOfBedRooms) {
                if (this.topPropertyList[i].NumberOfBedRooms >= minRoom && this.topPropertyList[i].NumberOfBedRooms <= maxRoom) {
                  if (this.topPropertyList[i].Price >= minPrice && this.topPropertyList[i].Price <= maxPrice) {
                    toReturn.push(this.topPropertyList[i]);
                  }
                }
              }
              else if (this.topPropertyList[i].Price > minPrice && this.topPropertyList[i].Price < maxPrice) {
                toReturn.push(this.topPropertyList[i]);
              }
            }
          }
        }
      }
    }
    return toReturn;
  }


  createPropertyListSell() {
    this.omnicasaService.getPropertyList()
      .subscribe((data: any) => {
        this.propertyList = data.GetPropertyListJsonResult.Value.Items;
        return new Promise<Property>((resolve, reject) => {
          for (let i = 0; i < this.propertyList.length; i++) {
            if (i > 150 && this.propertyList[i].SubStatus != 2) {
              this.firestore
                .collection("sellProperties")
                .doc(i.toString())
                .set(this.propertyList[i])
            }
          }
        });
      });
  }

  createPropertyListActive() {
    this.omnicasaService.getPropertyList()
      .subscribe((data: any) => {
        this.propertyList = data.GetPropertyListJsonResult.Value.Items;
        let invertPropertyList: Property[];
        invertPropertyList = [] ;
        for (let i = 0, j=this.propertyList.length-1; i<this.propertyList.length; i++,j--){
          invertPropertyList[i] = this.propertyList[j];
        }
        return new Promise<Property>((resolve, reject) => {
          for (let i = 0; i < invertPropertyList.length; i++) {
            if (invertPropertyList[i].SubStatus == 2 || invertPropertyList[i].SubStatus == 3) {
              this.firestore
                .collection("activeProperties")
                .doc(i.toString())
                .set(invertPropertyList[i])
            }
          }
        });
      });
  }






}
