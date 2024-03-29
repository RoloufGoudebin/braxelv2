import { Component, OnInit} from '@angular/core';
import { Property} from '../services/omnicasa/interface';
import { ActivatedRoute } from '@angular/router';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service';
import { TranslateService } from '@ngx-translate/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.css'],

})
export class ViewPropertyComponent implements OnInit {

  imageObject: Array<object> = [];


  showFlag: boolean = false;
  selectedImageIndex: number = -1;

  slickModal;

  isSSR = true;


  slideConfig = { slidesToShow: 1, slidesToScroll: 1, adaptiveHeight: true, arrows: false };
  slideConfigNavXl = {
    arrows: true,
    slidesToShow: 6,
    slidesToScroll: 6,
    adaptiveHeight: true
  };
  slideConfigNavXs = {
    adaptiveHeight: true,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 3
  };

  showLightbox(index: number) {
    this.selectedImageIndex = index;
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
    this.selectedImageIndex = -1;
  }

  slickInit(e) {
  }

  breakpoint(e) {
  }

  afterChange(e) {
  }

  beforeChange(e) {
  }


  propertyList: Property[];
  topPropertyList: Property[];
  property: Property;
  id: number;
  lat: number;
  long: number;
  nodalLink: string;
  lang: string;
  listInfo: String[] = ["KitchenName", "WindowGlazing", "OrientationT", "HasLift", "Floor", "ConstructionYear", "SurfaceTerrace", "ConstructionName", "SurfaceGarden", "HeatingName", "MainStyleName", "ConditionName"];
  loadPic = false;


  constructor(private route: ActivatedRoute, public omnicasa: OmnicasaService, private translate: TranslateService, private meta : Meta) { }


  ngOnInit(): void {
    this.lang = this.translate.currentLang;
    this.id = this.route.snapshot.params['id'];
    this.omnicasa.getPropertyByID(this.id, this.lang).subscribe((data: any) => {
      this.property = data.GetPropertiesByIDsJsonResult.Value.Items[0];
      this.lat = +this.property.GoogleX;
      this.long = +this.property.GoogleY;
      this.nodalLink = this.property.VirtualTour;
      for (let i = 0; i < this.property.LargePictures.length; i++) {
        this.imageObject.push({ image: this.property.LargePictures[i] });
      }
    });;

    //check if is server side rendering
    if (typeof window !== 'undefined') {
      this.isSSR = false;
    }

    this.meta.updateTag({name:'canonical', content:'https://braxel.be/biens-immobiliers/'+this.id})
  }



  toStringPrice(price: number) {
    let toChange = price.toString();
    return toChange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  }

  getPEB(value: number) {


    //Bxl
    if (this.property.Zip >= 1000 && this.property.Zip <= 1299) {
      if (value <= 45) {
        return "/assets/img/peb/peb_a.png";
      }
      else if (value <= 95) {
        return "/assets/img/peb/peb_b.png";
      }
      else if (value <= 150) {
        return "/assets/img/peb/peb_c.png";
      }
      else if (value <= 210) {
        return "/assets/img/peb/peb_d.png";
      }
      else if (value <= 275) {
        return "/assets/img/peb/peb_e.png";
      }
      else if (value <= 345) {
        return "/assets/img/peb/peb_f.png";
      }
      else {
        return "/assets/img/peb/peb_g.png";
      }
    }

    //Flandre
    else if ((this.property.Zip >= 1500 && this.property.Zip < 4000) || (this.property.Zip >= 8000 && this.property.Zip < 10000)) {
      if (value < 0) {
        return "/assets/img/peb/peb_aplus.png";
      }
      else if (value < 100) {
        return "/assets/img/peb/peb_a.png";
      }
      else if (value < 200) {
        return "/assets/img/peb/peb_b.png";
      }
      else if (value < 300) {
        return "/assets/img/peb/peb_c.png";
      }
      else if (value < 400) {
        return "/assets/img/peb/peb_d.png";
      }
      else if (value < 500) {
        return "/assets/img/peb/peb_e.png";
      }
      else {
        return "/assets/img/peb/peb_f.png";
      }
    }

    //Wallonie
    else {
      if (value < 45) {
        return "/assets/img/peb/peb_aplus.png";
      }
      else if (value <= 85) {
        return "/assets/img/peb/peb_a.png";
      }
      else if (value <= 170) {
        return "/assets/img/peb/peb_b.png";
      }
      else if (value <= 255) {
        return "/assets/img/peb/peb_c.png";
      }
      else if (value <= 340) {
        return "/assets/img/peb/peb_d.png";
      }
      else if (value <= 425) {
        return "/assets/img/peb/peb_e.png";
      }
      else if (value <= 510) {
        return "/assets/img/peb/peb_f.png";
      }
      else {
        return "/assets/img/peb/peb_g.png";
      }
    }
  }


  getColor(goal: number, subStatus: number) {
    if (goal == 0 && subStatus == 2) {
      return '#283152'
    }
    if (goal == 1 && subStatus == 2) {
      return '#283152';
    }
    if (goal == 0 && subStatus == 3) {
      return '#26CE6C';
    }
    if (goal == 0 && subStatus == 6) {
      return '#26CE6C';
    }
    if (goal == 1 && subStatus == 13) {
      return '#FFC738';
    }

  }

  getStatus(goal: number, subStatus: number) {
    if (goal == 0 && subStatus == 2) {
      //check language
      if (this.lang == 'fr') {
        return 'À vendre';
      }
      else if(this.lang == 'nl') {
        return 'Te koop';
      }
      else {
        return 'For sale'
      }
    }
    if (goal == 1 && subStatus == 2) {
      //check language
      if (this.lang == 'fr') {
        return 'À louer';
      }
      else if(this.lang == 'nl') {
        return 'Te huur';
      }
      else {
        return 'For rent'
      }
    }
    if (goal == 0 && subStatus == 3) {
      //check language
      if (this.lang == 'fr') {
        return 'Sous option';
      }
      else if(this.lang == 'nl') {
        return 'Onder optie';
      }
      else {
        return 'Under option'
      }
    }
    if (goal == 0 && subStatus == 6) {
      //check language
      if (this.lang == 'fr') {
        return 'VENDU';
      }
      else if(this.lang == 'nl') {
        return 'VERKOCHT';
      }
      else {
        return 'SOLD'
      }
    }
    if (goal == 1 && subStatus == 13) {
      //check language
      if (this.lang == 'fr') {
        return 'Loué';
      }
      else if(this.lang == 'nl') {
        return 'Verhuurd';
      }
      else {
        return 'Rented'
      }
    }
  }

}

