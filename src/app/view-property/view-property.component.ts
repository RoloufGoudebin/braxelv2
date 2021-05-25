import { Component, OnInit, Input } from '@angular/core';
import { Property, PropertyList } from '../services/omnicasa/interface';
import { ActivatedRoute } from '@angular/router';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service';
import { FirestoreService } from '../services/firebase/firestore.service';

@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.css']
})
export class ViewPropertyComponent implements OnInit {

  propertyList: Property[];
  topPropertyList: Property[];
  property: Property;
  id: number;
  lat: number;
  long: number;
  listInfo: String[] = ["KitchenName", "WindowGlazing", "OrientationT", "HasLift", "Floor", "ConstructionYear", "SurfaceTerrace", "ConstructionName", "SurfaceGarden", "HeatingName", "MainStyleName", "ConditionName"];

  constructor(private route: ActivatedRoute, public omnicasa: OmnicasaService, private firestore: FirestoreService) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.firestore.getFirestoreCollection('topProperties').subscribe(data => {
      this.topPropertyList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Property
        }
      })
      for (let i = 0; i < this.topPropertyList.length; i++) {
        if (this.topPropertyList[i].ID == this.id) {
          this.property = this.topPropertyList[i];
        }
      }
      this.lat = +this.property.GoogleX;
      this.long = +this.property.GoogleY;
    });



  }

  toStringPrice(price: number) {
    let toChange = price.toString();
    return toChange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  }

  getLat(lat: number) {
    var random = Math.random();
    return lat -0.002;
  }

  getLong(long: number) {
    var random = Math.random();
    return long +0.002;
  }

  getPEB(value: number) {
    if (value < 15) {
      return "assets/img/peb/peb_aplus.png";
    }
    else if (value < 51) {
      return "assets/img/peb/peb_a.png";
    }
    else if (value < 91) {
      return "assets/img/peb/peb_b.png";
    }
    else if (value < 151) {
      return "assets/img/peb/peb_c.png";
    }
    else if (value < 231) {
      return "assets/img/peb/peb_d.png";
    }
    else if (value < 331) {
      return "assets/img/peb/peb_e.png";
    }
    else if (value < 451) {
      return "assets/img/peb/peb_f.png";
    }
    else {
      return "assets/img/peb/peb_g.png";
    }
  }


}

