import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'cadastrar-viagem',
    loadComponent: () => import('./features/viagens/viagem-form/viagem-form').then((m) => m.ViagemForm),
    canActivate: [authGuard],
  },
  {
    path: 'viagens',
    loadComponent: () => import('./features/viagens/viagem-list/viagem-list').then((m) => m.ViagemList),
    canActivate: [authGuard],
  },
  {
    path: 'viagens/:id',
    loadComponent: () =>
      import('./features/viagens/viagem-detail/viagem-detail').then((m) => m.ViagemDetail),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
