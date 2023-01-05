import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDatasService {

  constructor() { }

  numberPropertyOurBiens = 9;

  addPropertiesOurBiens() {
    this.numberPropertyOurBiens = this.numberPropertyOurBiens + 6;
  }

  resetPropertiesOurBiens() {
    this.numberPropertyOurBiens = 9;
  }

}
