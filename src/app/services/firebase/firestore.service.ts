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



  getFirestoreCollection(collection) {
    return this.firestore.collection(collection).snapshotChanges();
  }

  updatePropertyTop(property: Property, id: number) {
    this.propertyList[id] = property;
  }



  /*getPropertyList(): Observable<PropertyList> {

    if (this.propertyList) {
      console.log(this.propertyList);
      return of(this.propertyList);
    }

    return this.http.get<PropertyList>(this.link)
      .pipe(tap((returnedData: PropertyList) => {
        //save the returned data so we can re-use it later without making more HTTP calls
        this.propertyList = returnedData;
      }));
  }*/




  createPropertyList() {
    this.omnicasaService.getPropertyList()
      .subscribe((data: any) => {
        this.propertyList = data.GetPropertyListJsonResult.Value.Items;
        console.log(this.propertyList);
        return new Promise<Property>((resolve, reject) => {
          for (let i = 0; i < 10; i++)
            this.firestore
              .collection("topProperties")
              .add(this.propertyList[i])
              .then(res => { }, err => reject(err));
        });
      });
  }




}
