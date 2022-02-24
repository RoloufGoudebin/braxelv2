import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent implements OnInit {

  constructor(private firestore: FirestoreService, private formBuilder: FormBuilder) { }
  cards: any[];
  toSwap = [-1, -1];
  show = false;
  numberReviews;
  reviewForm = this.formBuilder.group({
    author: '',
    review: '',
    rate: ''
  });

  numberForm = this.formBuilder.group({
    newNumberReviews: ''
  })


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

    this.firestore.getFirestoreCollection('numberReviews').subscribe(data =>
      this.numberReviews = data.map(e => {
        return {
          ...e.payload.doc.data() as any
        }
      }));
  }

  swap() {
    let tmp = this.cards[this.toSwap[0]];
    let tmpid = this.cards[this.toSwap[0]].id;
    let tmpidBis = this.cards[this.toSwap[1]].id;
    this.cards[this.toSwap[0]] = this.cards[this.toSwap[1]];
    this.cards[this.toSwap[0]].id = tmpid;
    this.cards[this.toSwap[1]] = tmp;
    this.cards[this.toSwap[1]].id = tmpidBis;
    this.toSwap[0] = -1;
    this.toSwap[1] = -1;
  }

  save() {
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
    else if (this.toSwap[1] == -1) {
      this.toSwap[1] = id;
    }
    else if (this.toSwap[0] != -1 && this.toSwap[1] != -1) {
      this.toSwap[0] = -1;
      this.toSwap[1] = -1;
    }
  }

  sort() {
    this.cards.sort(function (a, b) {
      return a.id - b.id;
    });;
    this.show = true;
  }

  onSubmitReview(): void {
    this.firestore.addReview(this.reviewForm.value.author, this.reviewForm.value.rate, this.reviewForm.value.review, this.cards.length);
    setTimeout(() => {
      this.cards.sort(function (a, b) {
        return a.id - b.id;
      });;
    },
      1500);
  }

  onSubmitNumber(){
    let newNumber : any =  {
      number: this.numberForm.value.newNumberReviews
    }
    this.firestore.updateNumberReviews(newNumber)
  }

  delete() {
    this.firestore.deleteReview(this.toSwap[0], this.cards.length);
    setTimeout(() => {
      this.cards.sort();
    },
      1500);
    this.toSwap[0] = -1;
  }





}
