import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isNavbarCollapsed = true;

  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
    document.getElementById("tapbar").style.bottom = "-20%";

    //check if is server side rendering
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", function () {
        if (window.pageYOffset == 0) {
          document.getElementById("tapbar").style.bottom = "-20%";
        }
        else {
          document.getElementById("tapbar").style.bottom = "0%";
        }
      }, false);
    }

  }

}


