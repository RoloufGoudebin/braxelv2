import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service'
import { Property} from '../services/omnicasa/interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-view-property-list',
  templateUrl: './view-property-list.component.html',
  styleUrls: ['./view-property-list.component.css']

})
export class ViewPropertyListComponent implements OnInit {

  propertyList: Property[];

  constructor(private readonly omnicasaService: OmnicasaService) { }

  ngOnInit(): void {


    this.omnicasaService.getPropertyList()
      .subscribe((data: any) => {
         this.propertyList = data.GetPropertyListJsonResult.Value.Items;
      });

  }


}
