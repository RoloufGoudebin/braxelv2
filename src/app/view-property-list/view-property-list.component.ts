import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FirestoreService } from '../services/firebase/firestore.service';
import { Property } from '../services/omnicasa/interface';
import { getStatusColor, getStatusLabel } from '../shared/utils/property-status.util';

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
    return getStatusColor(goal, subStatus);
  }

  getStatus(goal: number, subStatus: number) {
    return getStatusLabel(this.lang, goal, subStatus);
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
