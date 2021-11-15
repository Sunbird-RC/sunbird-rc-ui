import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsComponent } from './forms/forms.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { PanelsComponent } from './layouts/modal/panels/panels.component';
import { EditPanelComponent } from './layouts/modal/panels/edit-panel/edit-panel.component';
import { AddPanelComponent } from './layouts/modal/panels/add-panel/add-panel.component';
import { TablesComponent } from './tables/tables.component';
import { AttestationComponent } from './tables/attestation/attestation.component';
import { AuthGuard } from './utility/app.guard';
import { DocViewComponent } from './layouts/doc-view/doc-view.component';
import { InstallComponent } from './install/install.component';
import { HomeComponent } from './home/home.component';
import { KeycloakloginComponent } from './authentication/login/keycloaklogin.component';
import { LogoutComponent } from './authentication/logout/logout.component';
  import { SearchComponent } from './discovery/search/search.component';
import { DocumentComponent } from './document/document.component';
import { ElockerDashboardComponent } from './elocker-dashboard/elocker-dashboard.component';
const routes: Routes = [
// Home
{ path: '', component: HomeComponent },

// Auth
{ path: 'login', component: KeycloakloginComponent ,  canActivate: [AuthGuard]},
{ path: 'logout', component: LogoutComponent},

// Forms
{ path: 'form/:form', component: FormsComponent },
{ path: 'form/:form/:id', component: FormsComponent, canActivate: [AuthGuard] },


// Layouts
// { path: ':layout', component: LayoutsComponent, canActivate: [AuthGuard] },
{
  path: 'profile/:layout', component: LayoutsComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: 'edit',
      component: PanelsComponent,
      outlet: 'claim',
      children: [
        {
          path: ':form',
          component: EditPanelComponent
        },
        {
          path: ':form/:id',
          component: EditPanelComponent
        }
      ]
    },
    {
      path: 'add',
      component: PanelsComponent,
      outlet: 'claim',
      children: [
        {
          path: ':form',
          component: AddPanelComponent
        }
      ]
    }
  ]
},


// Tables
{ path: ':entity/attestation/:table', component: TablesComponent, canActivate: [AuthGuard] },
{ path: ':entity/attestation/:table/:id', component: AttestationComponent, canActivate: [AuthGuard] },
{ path: 'document/view', component: DocViewComponent, canActivate: [AuthGuard] },
{ path: 'discovery', component: SearchComponent },
{ path: 'documents', component: DocumentComponent },
{ path: 'dashboard', component: ElockerDashboardComponent },

// Installation
{ path: 'install', component: InstallComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
