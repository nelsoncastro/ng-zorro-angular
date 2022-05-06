import { DepartamentAddComponent } from './departament/departament-add/departament-add.component';
import { DepartamentComponent } from './departament/departament.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DepartamentComponent },
  { path: 'departament', component: DepartamentComponent },

  { path: 'add', component: DepartamentAddComponent },
  { path: 'edit/:id', component: DepartamentAddComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
