import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PropertyList, Property } from './interface';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OmnicasaService {

  constructor(public http: HttpClient) { }

  link = "http://newapi.omnicasa.com/1.12/OmnicasaService.svc/GetPropertyListJson?json={%27DescriptionLanguageId%27:2,%20%27LanguageId%27:2,%20%27CustomerName%27:%27braxel%27,%20%27CustomerPassword%27:%27b688E6B8FDD2%27}";


  propertyList: PropertyList;
  property: Property;

  getPropertyList(): Observable<PropertyList> {

    if (this.propertyList) {
      return of(this.propertyList);
    }

    return this.http.get<PropertyList>(this.link)
      .pipe(tap((returnedData: PropertyList) => {
        //save the returned data so we can re-use it later without making more HTTP calls
        this.propertyList = returnedData;
        
      }));
  }

  getListOfZip(){
    var propertylistZip = this.getPropertyList;
    console.log(propertylistZip);
    for (let i in propertylistZip){
      if (propertylistZip[i].zip){
        console.log("yoooo");
      }
    }
  }

  getPropertyByID(id: number): Observable<Property>{
    return this.http.get<Property>("http://newapi.omnicasa.com/1.12/OmnicasaService.svc/GetPropertiesByIDsJson?json={%27IDs%27:%27"+id+"%27,%20%27LanguageId%27:2,%20%27CustomerName%27:%27braxel%27,%20%27CustomerPassword%27:%27b688E6B8FDD2%27}")
      .pipe(tap((returnedData: Property) => {
        //save the returned data so we can re-use it later without making more HTTP calls
        this.property = returnedData;
        
      }));
  }



}