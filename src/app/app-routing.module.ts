import { LogoutComponent } from './pages/auth/logout/logout.component';
import { AuthGuard } from './core/auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { SigninComponent } from 'app/pages/auth/signin/signin.component';
import { HomeComponent } from 'app/pages/home/home/home.component';
import { LoginComponent } from 'app/pages/auth/login/login.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'departament', loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule) },
      { path: 'member', loadChildren: () => import('./pages/member/member.module').then(m => m.MemberModule) },
      { path: 'logout', component: LogoutComponent },
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '', component: SigninComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthService]
})
export class AppRoutingModule { }
