import { Component, OnInit, Input } from '@angular/core';
import { Property, PropertyList } from '../services/omnicasa/interface';
import { ActivatedRoute } from '@angular/router';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service';
import { FirestoreService } from '../services/firebase/firestore.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private route: ActivatedRoute, public omnicasa: OmnicasaService, private translate: TranslateService) { }


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
  }



  toStringPrice(price: number) {
    let toChange = price.toString();
    return toChange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  }

  getPEB(value: number) {

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

    else {
      if (value < 15) {
        return "/assets/img/peb/peb_aplus.png";
      }
      else if (value < 51) {
        return "/assets/img/peb/peb_a.png";
      }
      else if (value < 91) {
        return "/assets/img/peb/peb_b.png";
      }
      else if (value < 151) {
        return "/assets/img/peb/peb_c.png";
      }
      else if (value < 231) {
        return "/assets/img/peb/peb_d.png";
      }
      else if (value < 331) {
        return "/assets/img/peb/peb_e.png";
      }
      else if (value < 451) {
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
      return 'À VENDRE';
    }
    if (goal == 1 && subStatus == 2) {
      return 'À LOUER';
    }
    if (goal == 0 && subStatus == 3) {
      return 'SOUS OPTION';
    }
    if (goal == 0 && subStatus == 6) {
      return 'VENDU';
    }
    if (goal == 1 && subStatus == 13) {
      return 'LOUÉ';
    }
  }

}

