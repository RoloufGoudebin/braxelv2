import { Component, AfterViewInit } from '@angular/core';
import { FirestoreService } from '../services/firebase/firestore.service';

declare const google: any;

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent {
  service;
  public reviews = [];
  show = false;
  public innerWidth: any;

  constructor(private firestore: FirestoreService) { }

  slides: any = [[]];
  cards: any;


  ngOnInit() {
    this.innerWidth = window.innerWidth;
    setTimeout(() => {
      this.cards.sort(function (a, b) {
        return a.id - b.id;
      });;
    },
      1500);
    this.firestore.getFirestoreCollection('avis').subscribe(data =>
      this.cards = data.map(e => {
        return {
          id: Number(e.payload.doc.id),
          ...e.payload.doc.data() as any
        }
      }));

  }

  /**
  ngAfterViewInit() {
    const request = {
      placeId: "ChIJIxgLPcrRw0cREMNq7b82f-0",
      fields: ['reviews']
    };
    this.service = new google.maps.places.PlacesService(document.getElementById('googleReviews'));

    this.service.getDetails(request, this.callback);
  }

  public callback = (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      this.reviews = place.reviews.slice();
      console.log(this.slides);
      if (this.innerWidth > 1000) {
        this.slides = this.chunk(this.reviews, 3);
      }
      if (this.innerWidth > 600 && this.innerWidth < 1000) {
        this.slides = this.chunk(this.reviews, 2);
      }

      if (this.innerWidth < 600 && this.innerWidth < 1000) {
        this.slides = this.chunk(this.reviews, 1);
      }
    }
  };**/

  createRange(number) {
    const items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  isReviews() {
    if (this.reviews.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }
}

