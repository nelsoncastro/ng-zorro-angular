import { WelcomeThreeComponent } from './welcome-three/welcome-three.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeAddComponent } from './welcome-add/welcome-add.component';
import { WelcomeTwoComponent } from './welcome-two/welcome-two.component';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [

  { path: '', component: WelcomeComponent },

  { path: 'product', component: WelcomeComponent },
  { path: 'add', component: WelcomeAddComponent },
  { path: 'edit/:id', component: WelcomeAddComponent },

  { path: 'two', component: WelcomeTwoComponent },
  { path: 'three', component: WelcomeThreeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
