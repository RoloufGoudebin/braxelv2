import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SafePipe } from 'src/app/safe.pipe';
import { SafeHtml, SafeUrl } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-modal-nodal',
  templateUrl: './modal-nodal.component.html',
  styleUrls: ['./modal-nodal.component.css']
})
export class ModalNodalComponent implements OnInit{

  closeResult = '';

  @Input() item = '';

  url ;
  
  constructor(private modalService: NgbModal, private domSanitizer: DomSanitizer) { }

  ngOnInit(){
    this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(this.item);
  }

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

}
