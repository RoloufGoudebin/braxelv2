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

import { AgmCoreModule } from '@agm/core';
import { AgencyComponent } from './agency/agency.component';
import { ContactComponent } from './contact/contact.component';
import { ServicesComponent } from './services-braxel/services.component';
import { FooterComponent } from './footer/footer.component';
import { FaqComponent } from './faq/faq.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ViewPropertyListComponent,
    ViewPropertyComponent,
    AgencyComponent,
    ContactComponent,
    ServicesComponent,
    FooterComponent,
    FaqComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyATpESf9vy24duvdNS3TeSOQE7XBUSnUtA'
    })
  ],
  providers: [OmnicasaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
