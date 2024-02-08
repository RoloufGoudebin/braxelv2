import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service'
import { Property } from '../services/omnicasa/interface';
import { FirestoreService } from '../services/firebase/firestore.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-view-property-list',
  templateUrl: './view-property-list.component.html',
  styleUrls: ['./view-property-list.component.css']

})
export class ViewPropertyListComponent implements OnInit {

  @Input() numberProperty: number;
  @Input() collectionName: string;
  @Input() propertyList: Property[];
  @Input() search: any[];
  lang;

  constructor(public firestore: FirestoreService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.lang = this.translate.currentLang;
    console.log(this.lang)
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
      if (this.lang == "fr") {
        return 'À VENDRE';
      }
      else if (this.lang == "en") {
        return 'For sale';
      }
      else if (this.lang == "nl") {
        return 'Te koop';
      }
    }
    if (goal == 1 && subStatus == 2) {
      if (this.lang == "fr") {
        return 'À LOUER';
      }
      else if (this.lang == "en") {
        return 'To rent';
      }
      else if (this.lang == "nl") {
        return 'te huur';
      }
    }
    if (goal == 0 && subStatus == 3) {
      if (this.lang == "fr") {
        return 'SOUS OPTION';
      }
      else if (this.lang == "en") {
        return 'under option';
      }
      else if (this.lang == "nl") {
        return 'under optie';
      }
    }
    if (goal == 0 && subStatus == 6) {
      if (this.lang == "fr") {
        return 'VENDU';
      }
      else if (this.lang == "en") {
        return 'sold';
      }
      else if (this.lang == "nl") {
        return 'verkocht';
      }
    }
    if (goal == 1 && subStatus == 13) {
      if (this.lang == "fr") {
        return 'LOUÉ';
      }
      else if (this.lang == "en") {
        return 'rented';
      }
      else if (this.lang == "nl") {
        return 'gehuur';
      }
    }
  }

  toStringPrice(price: number) {
    let toChange = price.toString();
    return toChange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  monthToLang(string: string) {
    if (this.lang == 'fr') {
      return string;
    }
    else if (this.lang == 'en') {
      //replace mois by month
      string = string.replace('mois', 'month');
      return string;
    }
    else if (this.lang == 'nl') {
      //replace mois by maand
      string = string.replace('mois', 'maand');
      return string;
    }
    return string;
  }

}
