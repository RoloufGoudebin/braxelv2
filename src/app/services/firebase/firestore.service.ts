import { FocusTrapManager } from '@angular/cdk/a11y/focus-trap/focus-trap-manager';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { count } from 'rxjs/operators';
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
  topPropertyListActive: Property[]






  getFirestoreCollection(collection) {
    return this.firestore.collection(collection).snapshotChanges();
  }

  savePropertyTop(newTopPropertyList: Property[]) {
    this.propertyListTop = newTopPropertyList;
    for (let i = 0; i < this.propertyListTop.length; i++) {
      this.firestore
        .collection("activeProperties")
        .doc(this.propertyListTop[i].id.toString())
        .set(this.propertyListTop[i])
    }
  }

  savePropertySell(newTopPropertyList: Property[]) {
    this.propertyListTop = newTopPropertyList;
    for (let i = 0; i < this.propertyListTop.length; i++) {
      this.firestore
        .collection("sellProperties")
        .doc(this.propertyListTop[i].id.toString())
        .set(this.propertyListTop[i])
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
        let invertPropertyList: Property[];
        invertPropertyList = [];
        for (let i = 0, j = this.propertyList.length - 1; i < this.propertyList.length; i++, j--) {
          invertPropertyList[i] = this.propertyList[j];
        }
        return new Promise<Property>((resolve, reject) => {
          for (let i = 0, j = 0; i < this.propertyList.length; i++) {
            if (invertPropertyList[i].SubStatus != 2 && invertPropertyList[i].SubStatus != 3) {
              this.firestore
                .collection("sellProperties")
                .doc(j.toString())
                .set(invertPropertyList[i])
              j++;
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
        invertPropertyList = [];
        for (let i = 0, j = this.propertyList.length - 1; i < this.propertyList.length; i++, j--) {
          invertPropertyList[i] = this.propertyList[j];
        }
        return new Promise<Property>((resolve, reject) => {
          for (let i = 0, j = 0; i < invertPropertyList.length; i++) {
            if (invertPropertyList[i].SubStatus == 2 || invertPropertyList[i].SubStatus == 3) {
              this.firestore
                .collection("activeProperties")
                .doc(j.toString())
                .set(invertPropertyList[i])
              j++;
            }
          }
        });
      });
  }

  createAvis(avis: any[]) {
    for (let i = 0; i < avis.length; i++) {
      avis[i].id = i;
      this.firestore
        .collection("avis")
        .doc(i.toString())
        .set(avis[i])
    }
  }

  updatePropertyListActive() {
    this.setPropertyListActiveFire();
    this.setPropertyListActiveOmni();
    setTimeout(() => {
      if (this.topPropertyListActive != null) {
        this.topPropertyListActive.sort(function (a, b) {
          return a.id - b.id;
        });
      }
      if (this.propertyList != null) {
        this.propertyList.sort(function (a, b) {
          return a.id - b.id;
        });
      }
      //supprime les biens qui ne sont plus disponibles
      for (let i = 0, count = 0; i < this.topPropertyListActive.length; i++) {
        for (let j = 0; j < this.propertyList.length; j++) {
          if (this.propertyList[j].ID == this.topPropertyListActive[i].ID) {
            this.topPropertyListActive[i].id = this.topPropertyListActive[i].id - count;
            break;
          }
          if (j == this.propertyList.length - 1) {
            this.topPropertyListActive.splice(i, 1);
            i--;
            count++;
          }
        }
      }
      //rajoute les nouveaux biens
      for (let i = 0; i < this.propertyList.length; i++) {
        for (let j = 0; j < this.topPropertyListActive.length; j++) {
          if (this.propertyList[i].ID == this.topPropertyListActive[j].ID) {
            if (this.topPropertyListActive[j].id > 5) {
            }
            break;
          }
          if (j == this.topPropertyListActive.length - 1) {
            this.topPropertyListActive.splice(6, 0, this.propertyList[i]);
            break;
          }

        }
      }
      for (let i = 0; i < this.topPropertyListActive.length; i++) {
        this.topPropertyListActive[i].id = this.topPropertyListActive.indexOf(this.topPropertyListActive[i]);
      }
      this.savePropertyTop(this.topPropertyListActive);
    },
      40000);

  }

  updateDateRefresh() {
    this.firestore
      .collection("refresh")
      .doc("1")
      .set({ "lastRefresh": Date.now() })
  }

  getDateRefresh() {
    return this.firestore.collection('refresh').snapshotChanges();

  }

  setPropertyListActiveFire() {
    this.getFirestoreCollection("activeProperties").subscribe(data =>
      this.topPropertyListActive = data.map(e => {
        return {
          id: Number(e.payload.doc.id),
          ...e.payload.doc.data() as Property
        }
      }));
  }

  setPropertyListActiveOmni() {
    this.omnicasaService.getPropertyList()
      .subscribe((data: any) => {
        this.propertyList = data.GetPropertyListJsonResult.Value.Items;
        let invertPropertyList: Property[];
        invertPropertyList = [];
        for (let i = 0, j = this.propertyList.length - 1; i < this.propertyList.length; i++, j--) {
          invertPropertyList[i] = this.propertyList[j];
        }
        return new Promise<Property>((resolve, reject) => {
          this.propertyList = [];
          for (let i = 0, j = 0; i < invertPropertyList.length; i++) {
            if (invertPropertyList[i].SubStatus == 2 || invertPropertyList[i].SubStatus == 3) {
              this.propertyList[j] = invertPropertyList[i];
              j++;
            }
          }
          this.updateDateRefresh();
        });
      });
  }






}