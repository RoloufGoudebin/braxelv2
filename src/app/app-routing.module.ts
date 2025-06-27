import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvisComponent as AvisAdminComponent } from './admin/avis/avis.component';
import { AuthGuard } from './admin/guard/auth.guard';
import { SignInComponent } from './admin/sign-in/sign-in.component';
import { StorageComponent } from './admin/storage/storage.component';
import { TopBiensComponent } from './admin/top-biens/top-biens.component';
import { AgencyComponent } from './agency/agency.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { OurBiensComponent } from './our-biens/our-biens.component';
import { RealisationsComponent } from './realisations/realisations.component';
import { ServicesComponent } from './services-braxel/services.component';
import { ViewPropertyComponent } from './view-property/view-property.component';



const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', data: {animationState: 'One'} },
  { path: 'agence', component: AgencyComponent, data: { animationState: 'Two'}},
  { path: 'services', component: ServicesComponent, data: { animationState: 'Three'}},
  { path: 'nos-biens', component: OurBiensComponent, data: { animationState: 'Four' }},
  { path: 'realisations', component: RealisationsComponent, data: { animationState: 'Five' }},
  { path: 'faq', component: FaqComponent, data: { animationState: 'Six'}},
  { path: 'contact', component: ContactComponent, data: { animationState: 'Seven' } },
  { path: 'biens-immobiliers/:id', component: ViewPropertyComponent, data: { animationState: 'biens-immobiliers' } },
  { path: 'admin', component: SignInComponent },
  { path: 'admin/top-biens', component: TopBiensComponent, canActivate: [AuthGuard] },
  { path: 'admin/avis', component: AvisAdminComponent, canActivate: [AuthGuard] },
  { path: 'admin/storage', component: StorageComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 135] 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
