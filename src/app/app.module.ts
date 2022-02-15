import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { Ng2OdometerModule } from 'ng2-odometer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { AngularFireStorageModule } from "@angular/fire/storage";

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
import { AvisComponent as AvisAdminComponent } from './admin/avis/avis.component';
import { ContactModalComponent } from './view-property/contact-modal/contact-modal.component';
import { SignInComponent } from './admin/sign-in/sign-in.component';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from "./admin/services/auth.service";
import { RealisationsComponent } from './realisations/realisations.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalAvisComponent } from './avis/modal-avis/modal-avis.component';
import { ModalNodalComponent } from './view-property/modal-nodal/modal-nodal.component';
import { SafePipe } from './safe.pipe';
import { ProutComponent } from './prout/prout.component';
import { LoadingComponent } from './loading/loading.component';
import { EstimationModalComponent } from './estimation-modal/estimation-modal.component';
import { CarouselHomeComponent } from './home/carousel-home/carousel-home.component';
import { AgentsComponent } from './home/agents/agents.component';
import { TopBiensSellComponent } from './admin/top-biens-sell/top-biens-sell.component';
import { StorageComponent } from './admin/storage/storage.component';

import { RouterModule } from '@angular/router';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from '@angular/common/http';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';


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
    ProutComponent,
    LoadingComponent,
    EstimationModalComponent,
    CarouselHomeComponent,
    AgentsComponent,
    TopBiensSellComponent,
    StorageComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSliderModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyATpESf9vy24duvdNS3TeSOQE7XBUSnUtA'
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgbModule,
    Ng2OdometerModule.forRoot(),
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgSelectModule,
    RouterModule,
    SlickCarouselModule,
    NgImageFullscreenViewModule,
    MDBBootstrapModulesPro.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
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
