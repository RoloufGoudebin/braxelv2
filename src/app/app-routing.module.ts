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



const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'agence', component: AgencyComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'biens-immobiliers/:id', component: ViewPropertyComponent },
  { path: 'nos-biens', component: OurBiensComponent },
  { path: 'admin', component: SignInComponent },
  { path: 'admin/top-biens', component: TopBiensComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
