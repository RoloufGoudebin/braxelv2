import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ViewPropertyListComponent } from './view-property-list/view-property-list.component';
import { OmnicasaService } from './services/omnicasa/omnicasa.service';
import { ViewPropertyComponent } from './view-property/view-property.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ViewPropertyListComponent,
    ViewPropertyComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [OmnicasaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
