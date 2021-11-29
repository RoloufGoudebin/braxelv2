import { Component, AfterViewInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent implements AfterViewInit {
  service;
  public reviews = [];
  show = false;
  public innerWidth: any;

  constructor() { }

  slides: any = [[]];

  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

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
  };

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

