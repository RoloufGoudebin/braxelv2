import { Component, OnInit, Input } from '@angular/core';
import { Property, PropertyList } from '../services/omnicasa/interface';
import { ActivatedRoute } from '@angular/router';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service';
import { FirestoreService } from '../services/firebase/firestore.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.css'],

})
export class ViewPropertyComponent implements OnInit {

  slides = [
    {img: "http://placehold.it/350x150/000000"},
    {img: "http://placehold.it/350x150/111111"},
    {img: "http://placehold.it/350x150/333333"},
    {img: "http://placehold.it/350x150/666666"}
  ];
  slideConfig = { arrows :true, slidesToShow: 1, slidesToScroll: 1};
  slideConfigNav = { arrows :true, slidesToShow: 5, slidesToScroll: 4};
  
  addSlide() {
    this.slides.push({img: "http://placehold.it/350x150/777777"})
  }
  
  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }
  
  slickInit(e) {
    console.log('slick initialized');
  }
  
  breakpoint(e) {
    console.log('breakpoint');
  }
  
  afterChange(e) {
    console.log('afterChange');
  }
  
  beforeChange(e) {
    console.log('beforeChange');
  }


  propertyList: Property[];
  topPropertyList: Property[];
  property: Property;
  id: number;
  lat: number;
  long: number;
  nodalLink: string;
  listInfo: String[] = ["KitchenName", "WindowGlazing", "OrientationT", "HasLift", "Floor", "ConstructionYear", "SurfaceTerrace", "ConstructionName", "SurfaceGarden", "HeatingName", "MainStyleName", "ConditionName"];

  constructor(private route: ActivatedRoute, public omnicasa: OmnicasaService, private firestore: FirestoreService, private http: HttpClient) { }


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.omnicasa.getPropertyByID(this.id).subscribe((data: any) => {
      this.property = data.GetPropertiesByIDsJsonResult.Value.Items[0];
      this.lat = +this.property.GoogleX;
      this.long = +this.property.GoogleY;
      this.nodalLink = this.property.VirtualTour;
    });;
  }



  toStringPrice(price: number) {
    let toChange = price.toString();
    return toChange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

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


  getColor(goal: number, subStatus: number) {
    if (goal==0 && subStatus==2) {
      return '#283152'
    }
    if (goal==1 && subStatus==2) {
      return '#283152';
    }
    if (goal==0 && subStatus==3) {
      return '#26CE6C';
    }
    if (goal==0 && subStatus==6) {
      return '#26CE6C';
    }
    if (goal==1 && subStatus==13) {
      return '#FFC738';
    }

  }

  getStatus(goal: number, subStatus: number) {
    if (goal==0 && subStatus==2) {
      return 'À VENDRE';
    }
    if (goal==1 && subStatus==2) {
      return 'À LOUER';
    }
    if (goal==0 && subStatus==3) {
      return 'SOUS OPTION';
    }
    if (goal==0 && subStatus==6) {
      return 'VENDU';
    }
    if (goal==1 && subStatus==13) {
      return 'LOUÉ';
    }
  }

}

