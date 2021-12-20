import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isNavbarCollapsed = true;

  constructor() { }

  ngOnInit(): void {
  }

}



let lastScrollTop = 0;

window.addEventListener("scroll", function(){  
   var st = window.pageYOffset;  
   if (st > lastScrollTop){
       document.getElementById("tapbar").style.bottom = "-100%";
   } else {
      document.getElementById("tapbar").style.bottom = "0";
   }
   lastScrollTop = st;
}, false);


