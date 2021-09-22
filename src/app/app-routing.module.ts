import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsComponent } from './forms/forms.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { PanelsComponent } from './layouts/modal/panels/panels.component';
import { EditPanelComponent } from './layouts/modal/panels/edit-panel/edit-panel.component';
import { AddPanelComponent } from './layouts/modal/panels/add-panel/add-panel.component';
import { TablesComponent } from './tables/tables.component';
import { FormDetailComponent } from './tables/form-detail/form-detail/form-detail.component';
import { AuthGuard } from './utility/app.guard';
import { DocViewComponent } from './layouts/doc-view/doc-view.component';

const routes: Routes = [
// Forms
{ path: 'form/:form', component: FormsComponent },
{ path: 'form/:form/:id', component: FormsComponent, canActivate: [AuthGuard] },


// Layouts
{ path: ':layout', component: LayoutsComponent, canActivate: [AuthGuard] },
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
{ path: ':entity/attestation/:table/:id', component: FormDetailComponent, canActivate: [AuthGuard] },
{ path: 'document/view', component: DocViewComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
