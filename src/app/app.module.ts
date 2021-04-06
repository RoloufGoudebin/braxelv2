import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';

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


import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AdminComponent } from './admin/admin.component';
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { TopBiensComponent } from './admin/top-biens/top-biens.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SliderComponent } from './slider/slider.component';
import { SearchPropertyComponent } from './search-property/search-property.component';
import { OurBiensComponent } from './our-biens/our-biens.component';
import { AvisComponent } from './avis/avis.component';
import { ContactModalComponent } from './view-property/contact-modal/contact-modal.component';
import { SignInComponent } from './admin/sign-in/sign-in.component';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from "./admin/services/auth.service";



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
    FaqComponent,
    AdminComponent,
    NavbarAdminComponent,
    TopBiensComponent,
    AlertModalComponent,
    SliderComponent,
    SearchPropertyComponent,
    OurBiensComponent,
    AvisComponent,
    ContactModalComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSliderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyATpESf9vy24duvdNS3TeSOQE7XBUSnUtA'
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    NgbModule
  ],
  providers: [OmnicasaService,
    AngularFireAuth,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
