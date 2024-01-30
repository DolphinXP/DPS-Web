import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },

  { path: 'test', loadChildren: () => import('./pages/test/test.routes').then(m => m.TEST_ROUTES) },
  { path: 'nomad', loadChildren: () => import('./pages/nomad/nomad.routes').then(m => m.NOMAD_ROUTES) },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) }
];
