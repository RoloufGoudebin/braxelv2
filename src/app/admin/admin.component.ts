import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firebase/firestore.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private readonly firestore: FirestoreService) { }

  ngOnInit(): void {
    //this.firestore.createPropertyList();
  }

}
