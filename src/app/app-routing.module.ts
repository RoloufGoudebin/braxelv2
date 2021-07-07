import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewPropertyComponent } from './view-property/view-property.component';
import { AgencyComponent } from './agency/agency.component';
import { ServicesComponent } from './services-braxel/services.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { TopBiensComponent } from './admin/top-biens/top-biens.component';
import { OurBiensComponent } from './our-biens/our-biens.component';
import { SignInComponent } from './admin/sign-in/sign-in.component';
import { AuthGuard } from './admin/guard/auth.guard';
import { RealisationsComponent } from './realisations/realisations.component';



const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', data: {animationState: 'One'} },
  { path: 'agence', component: AgencyComponent, data: { animationState: 'Two'}},
  { path: 'services', component: ServicesComponent, data: { animationState: 'Three'}},
  { path: 'nos-biens', component: OurBiensComponent, data: { animationState: 'Four' } },
  { path: 'realisations', component: RealisationsComponent, data: { animationState: 'Five' }},
  { path: 'faq', component: FaqComponent, data: { animationState: 'Six'}},
  { path: 'contact', component: ContactComponent, data: { animationState: 'Seven' } },
  { path: 'biens-immobiliers/:id', component: ViewPropertyComponent, data: { animationState: 'biens-immobiliers' } },
  { path: 'admin', component: SignInComponent },
  { path: 'admin/top-biens', component: TopBiensComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
