import { NgModule } from '@angular/core';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: '',
    ...canActivate(redirectUnauthorizedToLogin),
    loadComponent: () => import('./components/app-drawer/app-drawer.component').then(c => c.AppDrawerComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent),
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: 'integrations',
        loadComponent: () => import('./components/integrations/integrations.component').then(c => c.IntegrationsComponent),
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: 'evaluation',
        loadComponent: () => import('./components/evaluation/evaluation.component').then(c => c.EvaluationComponent),
        ...canActivate(redirectUnauthorizedToLogin)
      },
      {
        path: 'daily',
        loadComponent: () => import('./components/daily/daily.component').then(c => c.DailyComponent),
        ...canActivate(redirectUnauthorizedToLogin)
      },
      {
        path: 'activities',
        ...canActivate(redirectUnauthorizedToLogin),
        children: [
          {
            path: ':id',
            loadComponent: () => import('./components/activity-edit/activity-edit.component').then(c => c.ActivityEditComponent),
          }
        ]
      },
      {
        path: 'work-times',
        ...canActivate(redirectUnauthorizedToLogin),
        children: [
          {
            path: '',
            redirectTo: 'create',
            pathMatch: 'full'
          },
          {
            path: 'create',
            loadComponent: () => import('./components/work-time-create/work-time-create.component').then(c => c.WorkTimeCreateComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./components/work-time-edit/work-time-edit.component').then(c => c.WorkTimeEditComponent),
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
