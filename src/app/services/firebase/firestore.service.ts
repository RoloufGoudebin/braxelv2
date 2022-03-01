import { FocusTrapManager } from '@angular/cdk/a11y/focus-trap/focus-trap-manager';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import { count } from 'rxjs/operators';
import { Listener } from 'selenium-webdriver';
import { Property, PropertyList } from '../omnicasa/interface';
import { OmnicasaService } from '../omnicasa/omnicasa.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore, private omnicasaService: OmnicasaService, private translate: TranslateService) {
    this.lang = this.translate.currentLang;
  }

  lang: string;
  collection: any;

  propertyList: Property[];
  propertyListNl: Property[];
  propertyListEn: Property[];
  propertyListTop: Property[];
  topPropertyList: Property[];
  topPropertyListActive: Property[];
  propertyListSell: Property[] = [];
  topPropertyListSell: Property[] = [];

  getFirestoreCollection(collection) {
    return this.firestore.collection(collection).snapshotChanges();
  }

  savePropertyTop(newTopPropertyList: Property[]) {
    console.log(this.topPropertyListActive.length)
    if (this.topPropertyListActive.length > newTopPropertyList.length) {
      for (let i = 0; i < this.topPropertyListActive.length; i++) {
        if (i < newTopPropertyList.length) {
          if (typeof newTopPropertyList[i].id !== 'undefined') {
            this.firestore
              .collection("activeProperties")
              .doc(newTopPropertyList[i].id.toString())
              .set(newTopPropertyList[i])
          }
          else {
            this.firestore
              .collection("activeProperties")
              .doc(i.toString())
              .set(newTopPropertyList[i])
          }
        }
        else if (i >= newTopPropertyList.length) {
          console.log("hello");
          this.firestore
            .collection("activeProperties")
            .doc(i.toString())
            .delete
        }
      }
    }
    else {
      for (let i = 0; i < newTopPropertyList.length; i++) {
        if (typeof newTopPropertyList[i].id !== 'undefined') {
          this.firestore
            .collection("activeProperties")
            .doc(newTopPropertyList[i].id.toString())
            .set(newTopPropertyList[i])
        }
        else {
          this.firestore
            .collection("activeProperties")
            .doc(i.toString())
            .set(newTopPropertyList[i])
        }
      }
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
          let j = 0;
          for (let i = 0; i < this.propertyList.length; i++) {
            if (invertPropertyList[i].SubStatus != 2 && invertPropertyList[i].SubStatus != 3) {
              this.omnicasaService.getPropertyByID(invertPropertyList[i].ID, 'nl').subscribe((data: any) => {
                invertPropertyList[i].TypeDescriptionNl = data.GetPropertiesByIDsJsonResult.Value.Items[0].TypeDescription;
                this.omnicasaService.getPropertyByID(this.propertyList[i].ID, 'en').subscribe((data: any) => {
                  invertPropertyList[i].TypeDescriptionEn = data.GetPropertiesByIDsJsonResult.Value.Items[0].TypeDescription;
                  this.firestore
                    .collection("sellProperties")
                    .doc(j.toString())
                    .set(invertPropertyList[i]);
                  j++;
                })
              })
            }
          }
        });
      });
  }

  createPropertyListActive() {
    this.omnicasaService.getPropertyList()
      .subscribe((data: any) => {
        this.propertyList = data.GetPropertyListJsonResult.Value.Items;
        this.propertyList.sort(function (a, b) {
          return b.ID - a.ID;
        });

        return new Promise<Property>((resolve, reject) => {
          let j = 0;
          for (let i = 0; i < this.propertyList.length; i++) {
            if (this.propertyList[i].SubStatus == 2 || this.propertyList[i].SubStatus == 3) {
              this.omnicasaService.getPropertyByID(this.propertyList[i].ID, 'nl').subscribe((data: any) => {
                this.propertyList[i].TypeDescriptionNl = data.GetPropertiesByIDsJsonResult.Value.Items[0].TypeDescription;
                this.omnicasaService.getPropertyByID(this.propertyList[i].ID, 'en').subscribe((data: any) => {
                  this.propertyList[i].TypeDescriptionEn = data.GetPropertiesByIDsJsonResult.Value.Items[0].TypeDescription;
                  this.firestore
                    .collection("activeProperties")
                    .doc(j.toString())
                    .set(this.propertyList[i])
                  j++;
                })
              })
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

  addFileRef(fileRef: any) {
    this.firestore
      .collection("files")
      .doc(fileRef.name)
      .set(fileRef)
  }

  choseCarousel(file: any, pos: number) {
    if (pos == 3) {
      this.firestore
        .collection("home-carousel")
        .doc("the-best-3")
        .set(file)
    }
    else if (pos == 4) {
      this.firestore
        .collection("home-carousel")
        .doc("the-best-4")
        .set(file)
    }
  }

  deleteFile(fileRef: any) {
    this.firestore
      .collection("files")
      .doc(fileRef.name)
      .delete()
  }

  updatePropertyListActive() {
    let toCopy = [];
    this.setPropertyListActiveFire(); //topPropertyListActive
    this.setPropertyListActiveOmni(); //propertyList
    setTimeout(() => {
      if (this.topPropertyListActive != null) {
        this.topPropertyListActive.sort(function (a, b) {
          return b.id - a.id;
        });
      }
      if (this.propertyList != null) {
        this.propertyList.sort(function (a, b) {
          return b.ID - a.ID;
        });
      }

      for (let i = 0; i < this.propertyList.length; i++) {
        if (this.propertyList[i].SubStatus == 2 || this.propertyList[i].SubStatus == 3) {
          this.omnicasaService.getPropertyByID(this.propertyList[i].ID, 'nl').subscribe((data: any) => {
            this.propertyList[i].TypeDescriptionNl = data.GetPropertiesByIDsJsonResult.Value.Items[0].TypeDescription;
            this.omnicasaService.getPropertyByID(this.propertyList[i].ID, 'en').subscribe((data: any) => {
              this.propertyList[i].TypeDescriptionEn = data.GetPropertiesByIDsJsonResult.Value.Items[0].TypeDescription;
              toCopy.push(this.propertyList[i])
            })
          })
        }
      }



      //supprime les biens qui ne sont plus disponibles
      for (let j = 0; j < toCopy.length; j++) {
        for (let i = 0; i < this.topPropertyListActive.length - 1; i++) {
          if (toCopy[j].ID == this.topPropertyListActive[i].ID) {
            toCopy[j].id = this.topPropertyListActive[i].id;
            break;
          }
          if (i == this.topPropertyListActive.length - 1) {
            toCopy[j].id = 6;
            for (let k = 6; k < this.topPropertyListActive.length - 1; k++) {
              toCopy[k].id = this.topPropertyListActive.length[k].id + 1;
            }
          }
        }
      }
      setTimeout(() => {
        this.savePropertyTop(toCopy);
        this.updateDateRefresh();
      }, 30000)
    },
      40000);

  }

  updatePropertyListSell() {
    let toCopy = [];
    this.setPropertyListSellFire(); //topPropertyListActive
    this.setPropertyListSellOmni(); //propertyList
    setTimeout(() => {
      if (this.topPropertyListSell != null) {
        this.topPropertyListSell.sort(function (a, b) {
          return a.id - b.id;
        });
      }
      if (this.propertyListSell != null) {
        this.propertyListSell.sort(function (a, b) {
          return a.ID - b.ID;
        });
      }
      //rajoute les nouveaux biens
      for (let i = 0; i < this.propertyListSell.length; i++) {
        for (let j = 0; j < this.topPropertyListSell.length; j++) {
          if (this.propertyListSell[i].ID == this.topPropertyListSell[j].ID) {
            break;
          }
          if (j == this.topPropertyListSell.length - 1) {
            this.omnicasaService.getPropertyByID(this.propertyListSell[i].ID, 'nl').subscribe((data: any) => {
              this.propertyListSell[i].TypeDescriptionNl = data.GetPropertiesByIDsJsonResult.Value.Items[0].TypeDescription;
              this.omnicasaService.getPropertyByID(this.propertyListSell[i].ID, 'en').subscribe((data: any) => {
                this.propertyListSell[i].TypeDescriptionEn = data.GetPropertiesByIDsJsonResult.Value.Items[0].TypeDescription;
                this.topPropertyListSell.splice(0, 0, this.propertyListSell[i]);
              })
            })
            break;
          }

        }
      }
      for (let i = 0; i < this.topPropertyListSell.length; i++) {
        this.topPropertyListSell[i].id = i;
      }
      setTimeout(() => {
        this.savePropertySell(this.topPropertyListSell);
      }, 30000)
    },
      120000);

  }

  updateDateRefresh() {
    this.firestore
      .collection("refresh")
      .doc("1")
      .set({ "lastRefresh": Date.now() })
  }

  updateNumberReviews(document: any) {
    this.firestore
      .collection("numberReviews")
      .doc("ByyGuO4WlWMVhohauDQZ")
      .update({ "number": document.number })
  }

  getDateRefresh() {

    return this.firestore.collection('refresh').snapshotChanges();

  }

  getNumberReviews() {

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
      });
  }


  setPropertyListSellFire() {
    this.getFirestoreCollection("sellProperties").subscribe(data =>
      this.topPropertyListSell = data.map(e => {
        return {
          id: Number(e.payload.doc.id),
          ...e.payload.doc.data() as Property
        }
      }));
  }

  setPropertyListSellOmni() {
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
            if (invertPropertyList[i].SubStatus != 2 && invertPropertyList[i].SubStatus != 3) {
              this.propertyListSell[j] = invertPropertyList[i];
              j++;
            }
          }
        });
      });
  }

  addReview(author: string, rate: number, review: string, id: number) {
    this.firestore
      .collection("avis")
      .doc(id.toString())
      .set({ "author_name": author, "id": id, "rating": rate, "text": review })
  }

  deleteReview(id: number, length: number) {
    this.firestore
      .collection("avis")
      .doc(id.toString())
      .delete()
  }

}