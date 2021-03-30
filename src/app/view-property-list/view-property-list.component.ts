import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service'
import { Property } from '../services/omnicasa/interface';
import { FirestoreService } from '../services/firebase/firestore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-property-list',
  templateUrl: './view-property-list.component.html',
  styleUrls: ['./view-property-list.component.css']

})
export class ViewPropertyListComponent implements OnInit {

  topPropertyList: Property[];
  topPropertyListID: number[];
  propertyList: Property[];
  mergeList: Property[];
  @Input() numberProperty: number;

  constructor(private omnicasaService: OmnicasaService, private firestore: FirestoreService) { }

  ngOnInit(): void {

    this.firestore.getFirestoreCollection("topProperties").subscribe(data => {
      this.topPropertyList = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Property
        }
        console.log("prout");
      })
    });

    this.omnicasaService.getPropertyList()
      .subscribe((data: any) => {
        this.propertyList = data.GetPropertyListJsonResult.Value.Items;
        for (let i = this.propertyList.length - 1; i >= 0; i--) {

          this.topPropertyList.push(this.propertyList[i]);
        }
      });

  }

  getColor(marquee: number) {
    if (marquee == 0) {
      return '#233353'
    }
    if (marquee == 3) {
      return 'orange';
    }
    if (marquee == 4) {
      return 'orange';
    }
    if (marquee == 5) {
      return 'orange';
    }
  }


}
