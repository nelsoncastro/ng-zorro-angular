import { MemberAddComponent } from './member-add/member-add.component';
import { MemberComponent } from './member.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: MemberComponent },
  { path: 'member', component: MemberComponent },

  { path: 'add', component: MemberAddComponent },
  { path: 'edit/:id', component: MemberAddComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
