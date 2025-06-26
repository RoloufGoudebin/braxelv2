import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { OmnicasaService } from './services/omnicasa/omnicasa.service';
import { ViewPropertyListComponent } from './view-property-list/view-property-list.component';
import { ViewPropertyComponent } from './view-property/view-property.component';

import { AgmCoreModule } from '@agm/core';
import { AgencyComponent } from './agency/agency.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { FooterComponent } from './footer/footer.component';
import { ServicesComponent } from './services-braxel/services.component';


import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { environment } from "../environments/environment";

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AngularFireAuth } from "@angular/fire/auth";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { AdminComponent } from './admin/admin.component';
import { AvisComponent as AvisAdminComponent } from './admin/avis/avis.component';
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { AuthService } from "./admin/services/auth.service";
import { SignInComponent } from './admin/sign-in/sign-in.component';
import { TopBiensComponent } from './admin/top-biens/top-biens.component';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { AvisComponent } from './avis/avis.component';
import { OurBiensComponent } from './our-biens/our-biens.component';
import { RealisationsComponent } from './realisations/realisations.component';
import { SearchPropertyComponent } from './search-property/search-property.component';
import { SliderComponent } from './slider/slider.component';
import { ContactModalComponent } from './view-property/contact-modal/contact-modal.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { StorageComponent } from './admin/storage/storage.component';
import { ModalAvisComponent } from './avis/modal-avis/modal-avis.component';
import { EstimationModalComponent } from './estimation-modal/estimation-modal.component';
import { AgentsComponent } from './home/agents/agents.component';
import { CarouselHomeComponent } from './home/carousel-home/carousel-home.component';
import { LoadingComponent } from './loading/loading.component';
import { SafePipe } from './safe.pipe';
import { ModalNodalComponent } from './view-property/modal-nodal/modal-nodal.component';

import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CountUpModule } from 'ngx-countup';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SearchBarComponent } from './search-bar/search-bar.component';


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
    AvisAdminComponent,
    ContactModalComponent,
    SignInComponent,
    RealisationsComponent,
    ModalAvisComponent,
    ModalNodalComponent,
    SafePipe,
    LoadingComponent,
    EstimationModalComponent,
    CarouselHomeComponent,
    AgentsComponent,
    StorageComponent,
    SearchBarComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    NgxSliderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyATpESf9vy24duvdNS3TeSOQE7XBUSnUtA'
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgbModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgSelectModule,
    SlickCarouselModule,
    MDBBootstrapModulesPro.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CountUpModule
  ],
  providers: [OmnicasaService,
    AngularFireAuth,
    AuthService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
