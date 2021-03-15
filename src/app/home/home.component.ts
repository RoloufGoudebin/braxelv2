import { Component, OnInit } from '@angular/core';
import { Property } from '../services/omnicasa/interface';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public omnicasa: OmnicasaService) { }


  propertyList: Property[]; // liste des propriétés


  ngOnInit() {
  }


}
