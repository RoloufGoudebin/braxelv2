import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel-home',
  templateUrl: './carousel-home.component.html',
  styleUrls: ['./carousel-home.component.css']
})
export class CarouselHomeComponent implements OnInit {

  constructor() { }

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
        "name": "terrasse",
        "type": "img",
        "src": "../assets/img/banner_bg.jpg",
        "alt": "braxel, agence immobilière à Waterloo"
      }
  ]

  ngOnInit(): void {
  }

}

