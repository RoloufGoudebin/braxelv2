import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Property, PropertyList } from '../omnicasa/interface';
import { OmnicasaService } from '../omnicasa/omnicasa.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore, private omnicasaService: OmnicasaService) { }

  propertyList: Property[];
  propertyListTop: Property[];
  collection: any;



  

  getFirestoreCollection(collection) {
    return this.firestore.collection(collection).snapshotChanges();
  }

  savePropertyTop(newTopPropertyList: Property[]) {
    this.propertyListTop = newTopPropertyList;
    for (let i = 0; i < this.propertyListTop.length; i++) {
      this.firestore
        .collection("topProperties")
        .doc(i.toString())
        .set(newTopPropertyList[i])
    }
  }


  createPropertyList() {
    this.omnicasaService.getPropertyList()
      .subscribe((data: any) => {
        this.propertyList = data.GetPropertyListJsonResult.Value.Items;
        return new Promise<Property>((resolve, reject) => {
          for (let i = 0; i < 10; i++)
            this.firestore
              .collection("topProperties")
              .doc(i.toString())
              .set(this.propertyList[i])
        });
      });
  }




}
