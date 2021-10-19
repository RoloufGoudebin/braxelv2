import { Component, OnInit } from '@angular/core';
import { Pipe } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})

@Pipe({name: 'safeHtml'})
export class ServicesComponent implements OnInit {

  ngOnInit(): void {
  }


}
