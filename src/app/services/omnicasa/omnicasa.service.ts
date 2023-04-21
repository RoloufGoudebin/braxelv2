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

  link = "https://newapi.omnicasa.com/1.12/OmnicasaService.svc/GetPropertyListJson?json={%27LanguageId%27:2,%20%27CustomerName%27:%27braxel%27,%20%27CustomerPassword%27:%27b688E6B8FDD2%27}";
  linkActive= ""

  propertyList: Property[];
  property: Property;
  toReturn: Observable<any>;

  getPropertyList(): Observable<any> {
    this.toReturn = this.http.get<PropertyList>(this.link)
      .pipe(tap((returnedData: any) => {
        //save the returned data so we can re-use it later without making more HTTP calls
        this.propertyList = returnedData;
      }));
    return this.toReturn;
  }

  getPropertyByID(id: number, lang: string): Observable<Property> {
    let lg;
    if(lang === 'nl'){
      lg = 1;
    }
    else if (lang === 'fr'){
      lg = 2;
    }
    else if (lang === 'en'){
      lg = 3;
    }
    return this.http.get<Property>("https://newapi.omnicasa.com/1.12/OmnicasaService.svc/GetPropertiesByIDsJson?json={%27IDs%27:%27" + id + "%27,%20%27LanguageId%27:" + lg +",%20%27CustomerName%27:%27braxel%27,%20%27CustomerPassword%27:%27b688E6B8FDD2%27}")
      .pipe(tap((returnedData: Property) => {
        //save the returned data so we can re-use it later without making more HTTP calls
        this.property = returnedData;
      }));
  }

  demandRegister(name: string, firstname: string, typesID: number[], mail: string, phone: string, zip: string, priceMin: number, priceMax: number, minRooms: number, maxRooms: number, comment: string, surfaceMin: number){
    return "https://newapi.omnicasa.com/1.12/OmnicasaService.svc/DemandRegisterJson?json={%27Name%27:%27"+ name +"%27,%20%27FirstName%27:%27"+ firstname +" %27,%20%27Email%27:%27" + mail + "%27,%20%27TypeOfPropertyIDs%27:%27"+ typesID + "%27,%20%27PhoneNumber%27:%27"+ phone +"%27,%20%27Zips%27:%27"+ zip +"%27,%20%27PriceMin%27:"+ priceMin +",%20%27PriceMax%27:"+ priceMax+",%20%27MinRooms%27:"+ minRooms +",%20%27MaxRooms%27:"+ maxRooms +",%20%27Comment%27:%27"+ comment +"%27,%20%27LivingArea%27:0,%20%27CustomerName%27:%27braxel%27,%20%27CustomerPassword%27:%27b688E6B8FDD2%27}";
  }
}