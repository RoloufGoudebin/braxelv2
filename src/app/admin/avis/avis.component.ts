import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';

@Component({
  selector: 'app-admin-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent implements OnInit {

  constructor(private firestore: FirestoreService) { }
  cards: any[];
  toSwap=[-1, -1];
  show= false;

  ngOnInit(): void {
    this.firestore.getFirestoreCollection('avis').subscribe(data =>
      this.cards = data.map(e => {
        return {
          id: Number(e.payload.doc.id),
          ...e.payload.doc.data() as any
        }
      }));
    setTimeout(() => {
      this.cards.sort(function (a, b) {
        return a.id - b.id;
      });;
    },
      1500);
  }

  swap() {
    let tmp = this.cards[this.toSwap[0]];
    let tmpid = this.cards[this.toSwap[0]].id;
    let tmpidBis = this.cards[this.toSwap[1]].id;
    console.log(tmp)
    this.cards[this.toSwap[0]] = this.cards[this.toSwap[1]];
    this.cards[this.toSwap[0]].id = tmpid;
    this.cards[this.toSwap[1]] = tmp;
    this.cards[this.toSwap[1]].id = tmpidBis;
    this.toSwap[0] = -1;
    this.toSwap[1] = -1;
    console.log(this.cards);
  }

  save() {
    console.log(this.cards);
    this.firestore.createAvis(this.cards);
    setTimeout(() => {
      this.cards.sort(function (a, b) {
        return a.id - b.id;
      });;
    },
      1500);
  }

  selectSwap(id: number) {
    if (this.toSwap[0] == -1) {
      this.toSwap[0] = id;
    }
    else if (this.toSwap[1] == -1){
      this.toSwap[1] = id;
    }
    else if (this.toSwap[0] != -1 && this.toSwap[1] != -1){
      this.toSwap[0] = -1;
      this.toSwap[1] = -1;
    }
    console.log(this.toSwap)
  }

  sort(){
    this.cards.sort(function (a, b) {
      return a.id - b.id;
    });;
    setTimeout(() => {
      console.log(this.cards);
    },
      3000);
    this.show = true;
  }





}
