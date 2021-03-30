import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewPropertyComponent } from './view-property/view-property.component';
import { AgencyComponent } from './agency/agency.component';
import { ServicesComponent } from './services-braxel/services.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { AdminComponent } from './admin/admin.component';
import { TopBiensComponent } from './admin/top-biens/top-biens.component';
import { OurBiensComponent } from './our-biens/our-biens.component';


const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'agence', component: AgencyComponent },
  { path: 'services', component: ServicesComponent},
  { path: 'faq', component: FaqComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'biens-immobiliers/:id', component: ViewPropertyComponent},
  { path: 'admin', component: AdminComponent},
  { path: 'admin/top-biens', component: TopBiensComponent},
  { path: 'nos-biens', component: OurBiensComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
