import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Property } from '../omnicasa/interface';
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
  prout: Observable<any>

  getFirestoreCollection(collection) {
    return this.firestore.collection(collection).snapshotChanges();
  }

  savePropertyTop(newTopPropertyList: Property[]) {
    for (let i = 0; i < newTopPropertyList.length; i++) {
      console.log(newTopPropertyList[i].ID.toString())
      this.firestore
        .collection("activeProperties")
        .doc(newTopPropertyList[i].ID.toString())
        .update(newTopPropertyList[i])
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
            this.omnicasaService.getPropertyByID(this.propertyList[i].ID, 'nl').subscribe((data: any) => {
              this.propertyList[i].TypeDescriptionNl = data.GetPropertiesByIDsJsonResult.Value.Items[0].TypeDescription;
              this.omnicasaService.getPropertyByID(this.propertyList[i].ID, 'en').subscribe((data: any) => {
                this.propertyList[i].TypeDescriptionEn = data.GetPropertiesByIDsJsonResult.Value.Items[0].TypeDescription;
                let toWrite: Property = {
                  id: this.propertyList[i].ID,
                  ID: this.propertyList[i].ID,
                  Status: this.propertyList[i].Status,
                  City: this.propertyList[i].City,
                  SubStatus: this.propertyList[i].SubStatus,
                  Goal: this.propertyList[i].Goal,
                  TypeDescription: this.propertyList[i].TypeDescription,
                  TypeDescriptionEn: this.propertyList[i].TypeDescriptionEn,
                  TypeDescriptionNl: this.propertyList[i].TypeDescriptionNl,
                  ModifiedSubstatusDate: this.propertyList[i].ModifiedSubstatusDate,
                  Zip: this.propertyList[i].Zip,
                  LargePicture: this.propertyList[i].LargePicture,
                  Price: this.propertyList[i].Price,
                  PriceUnitText: this.propertyList[i].PriceUnitText,
                  NumberOfBedRooms: this.propertyList[i].NumberOfBedRooms,
                  VirtualTour: this.propertyList[i].VirtualTour,
                  MainTypeName: this.propertyList[i].MainTypeName,
                  WebID: this.propertyList[i].WebID
                }
                this.firestore
                  .collection("activeProperties")
                  .doc(toWrite.ID.toString())
                  .set(toWrite)
                j++;
              })
            })
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
      for (let i = 0; i < this.propertyList.length; i++) {
        //console.log(this.topPropertyListActive.findIndex(e => e.ID == this.propertyList[i].ID))
        this.omnicasaService.getPropertyByID(this.propertyList[i].ID, 'nl').subscribe((data: any) => {
          this.propertyList[i].TypeDescriptionNl = data.GetPropertiesByIDsJsonResult.Value.Items[0].TypeDescription;
          this.omnicasaService.getPropertyByID(this.propertyList[i].ID, 'en').subscribe((data: any) => {
            this.propertyList[i].TypeDescriptionEn = data.GetPropertiesByIDsJsonResult.Value.Items[0].TypeDescription;
            for (let j = 0; j < this.topPropertyListActive.length; j++) {
              if (this.propertyList.findIndex(e => e.ID === this.topPropertyListActive[j].ID) != -1) {
                if (this.propertyList[i].ID == this.topPropertyListActive[j].ID) {
                  let toWrite: Property = {
                    id: this.topPropertyListActive[j].id,
                    ID: this.propertyList[i].ID,
                    Status: this.propertyList[i].Status,
                    City: this.propertyList[i].City,
                    SubStatus: this.propertyList[i].SubStatus,
                    Goal: this.propertyList[i].Goal,
                    TypeDescription: this.propertyList[i].TypeDescription,
                    TypeDescriptionEn: this.propertyList[i].TypeDescriptionEn,
                    TypeDescriptionNl: this.propertyList[i].TypeDescriptionNl,
                    ModifiedSubstatusDate: this.propertyList[i].ModifiedSubstatusDate,
                    Zip: this.propertyList[i].Zip,
                    LargePicture: this.propertyList[i].LargePicture,
                    Price: this.propertyList[i].Price,
                    PriceUnitText: this.propertyList[i].PriceUnitText,
                    NumberOfBedRooms: this.propertyList[i].NumberOfBedRooms,
                    VirtualTour: this.propertyList[i].VirtualTour,
                    MainTypeName: this.propertyList[i].MainTypeName,
                    WebID: this.propertyList[i].WebID
                  }
                  this.firestore
                    .collection("activeProperties")
                    .doc(this.propertyList[i].ID.toString())
                    .update(toWrite)
                  break;
                }
                else if (j == this.topPropertyListActive.length - 1) {
                  let toWrite: Property = {
                    id: this.topPropertyListActive[j - 5].ID, //petit hack des familles pour pas que la propriété se retrouve en premier
                    ID: this.propertyList[i].ID,
                    Status: this.propertyList[i].Status,
                    City: this.propertyList[i].City,
                    SubStatus: this.propertyList[i].SubStatus,
                    Goal: this.propertyList[i].Goal,
                    TypeDescription: this.propertyList[i].TypeDescription,
                    TypeDescriptionEn: this.propertyList[i].TypeDescriptionEn,
                    TypeDescriptionNl: this.propertyList[i].TypeDescriptionNl,
                    ModifiedSubstatusDate: this.propertyList[i].ModifiedSubstatusDate,
                    Zip: this.propertyList[i].Zip,
                    LargePicture: this.propertyList[i].LargePicture,
                    Price: this.propertyList[i].Price,
                    PriceUnitText: this.propertyList[i].PriceUnitText,
                    NumberOfBedRooms: this.propertyList[i].NumberOfBedRooms,
                    VirtualTour: this.propertyList[i].VirtualTour,
                    MainTypeName: this.propertyList[i].MainTypeName,
                    WebID: this.propertyList[i].WebID
                  }
                  this.firestore
                    .collection("activeProperties")
                    .doc(this.propertyList[i].ID.toString())
                    .set(toWrite)
                }
              }
              else {
                this.deleteProperty(this.topPropertyListActive[j].ID);
                console.log(this.topPropertyListActive[j].ID);
              }

            }
          })
        })
      }
      console.log(this.propertyList);
      console.log(this.topPropertyListActive);
      setTimeout(() => {
        this.savePropertyTop(toCopy);
        this.updateDateRefresh();
      }, 30000)
    },
      60000);

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
    this.prout = this.getFirestoreCollection("activeProperties")
    this.prout.subscribe(data =>
      this.topPropertyListActive = data.map(e => {
        return {
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

  deleteProperty(id: number){
    this.firestore
      .collection("activeProperties")
      .doc(id.toString())
      .delete()
  }

}