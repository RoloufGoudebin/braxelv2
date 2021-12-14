import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firebase/firestore.service';

@Component({
  selector: 'app-carousel-home',
  templateUrl: './carousel-home.component.html',
  styleUrls: ['./carousel-home.component.css']
})
export class CarouselHomeComponent implements OnInit {

  constructor(private firestore: FirestoreService) {}

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
      },
      {
        "name":"image terrasse braxel",
        "type": "img",
        "src" : "../assets/img/hp.jpg",
        "alt" : "agents immobiliers brabant wallon"
      }
      
  ]

  ngOnInit(): void {
    this.firestore.getFirestoreCollection('home-carousel').subscribe(data=>
      this.carouselImg = data.map(e => {
        return {
          ...e.payload.doc.data() as any
        }
    }));
  }

}

