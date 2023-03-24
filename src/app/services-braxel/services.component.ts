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

  constructor(private domSanitizer: DomSanitizer){}

  url: any;

  ngOnInit(): void {
    this.url = this.domSanitizer.bypassSecurityTrustResourceUrl("https://nodalview.com/hsfAGKoz1CDKyi6HTgvySvsi");


  }


}
