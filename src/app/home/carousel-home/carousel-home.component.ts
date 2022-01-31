import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';

@Component({
  selector: 'app-carousel-home',
  templateUrl: './carousel-home.component.html',
  styleUrls: ['./carousel-home.component.css']
})
export class CarouselHomeComponent implements OnInit {

  

  constructor(private firestore: FirestoreService, private translate: TranslateService) {
    translate.setDefaultLang('en');
  }
  slideConfig = {"slidesToShow": 1, "slidesToScroll": 1, "autoplay": true, "fade": true, "autoplaySpeed": 5000};
  
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

  carouselImg: any[];

  carousel = [
      {
        "name": "vidéo dans les caisses",
        "type": "video",
        "src": "../assets/img/home-enfant.mp4"
      },
      {
        "name": "vidéo du lion",
        "type": "video",
        "src": "../assets/img/waterloo.mp4"
      }
  ]

  ngOnInit(): void {
    this.firestore.getFirestoreCollection('home-carousel').subscribe(data=>
      this.carouselImg = data.map(e => {
        return {
          ...e.payload.doc.data() as any
        }
    }));
    setTimeout(() => {
      console.log(this.carouselImg);
    },
      5000);
  }

  
}


