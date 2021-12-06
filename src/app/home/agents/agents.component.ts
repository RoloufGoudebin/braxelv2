import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {

  constructor() { }

  phone: string;

  ngOnInit(): void {
  }

  changePhone(number: string){
    this.phone= number;
  }

}
