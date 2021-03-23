import { Component } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

interface SliderDetails {
  minValue: number;
  highValue: number;
  floor: number;
  ceil: number;
  step: number;
}

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent {
  closeResult = '';

  constructor(private modalService: NgbModal) { }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  sliderRooms: SliderDetails =
    {
      minValue: 0,
      highValue: 10,
      floor: 0,
      ceil: 10,
      step: 1,
    }

  sliderSurface: SliderDetails =
    {
      minValue: 0,
      highValue: 500,
      floor: 0,
      ceil: 500,
      step: 10,
    }

    sliderPrice: SliderDetails =
    {
      minValue: 0,
      highValue: 2000000,
      floor: 0,
      ceil: 2000000,
      step: 10000,
    }

}
