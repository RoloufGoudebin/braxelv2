import { Component, AfterViewInit } from '@angular/core';
import { FirestoreService } from '../services/firebase/firestore.service';

declare const google: any;

@Component({
  selector: 'app-avis',
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent {
  public reviews = [];

  constructor(private firestore: FirestoreService) { }

  showFlag: boolean = false;
  selectedImageIndex: number = -1;
  text= '';
  author='';
  rating=5;
  numberReviews;


  slideConfigXl = { 
    slidesToShow: 3, 
    slidesToScroll: 3, 
    adaptiveHeight: true, 
    arrows: false
  };

  slideConfigXs = { 
    slidesToShow: 1, 
    slidesToScroll: 1, 
    adaptiveHeight: true, 
    arrows: false
  };

  closeEventHandler() {
    this.showFlag = false;
    this.selectedImageIndex = -1;
  }

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }

  slides: any = [[]];
  cards: any;

  ngOnInit() {
    this.firestore.getFirestoreCollection('avis').subscribe(data =>
      this.cards = data.map(e => {
        return {
          id: Number(e.payload.doc.id),
          ...e.payload.doc.data() as any
        }
      }).sort((a, b) => a.id - b.id));

      this.firestore.getFirestoreCollection('numberReviews').subscribe(data =>
        this.numberReviews = data.map(e => {
          return {
            ...e.payload.doc.data() as any
          }
        }));

  }



  createRange(number) {
    const items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

}

