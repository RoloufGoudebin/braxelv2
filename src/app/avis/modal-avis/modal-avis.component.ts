import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-avis',
  templateUrl: './modal-avis.component.html',
  styleUrls: ['./modal-avis.component.css']
})
export class ModalAvisComponent implements OnInit {

  @Input() avatar: string;
  @Input() author: string;
  @Input() range: string;
  @Input() text: string;
  @Input() date: string;

  constructor() { }

  ngOnInit(): void {
  }

  createRange(number) {
    const items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

}
