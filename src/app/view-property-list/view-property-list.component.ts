import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service'
import { Property } from '../services/omnicasa/interface';
import { FirestoreService } from '../services/firebase/firestore.service';

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

  constructor(public firestore: FirestoreService) { }

  ngOnInit(): void {
    this.propertyList.sort(function (a, b) {
      return a.id - b.id;
    });;
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

  toStringPrice(price: number) {
    let toChange = price.toString();
    return toChange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

}
