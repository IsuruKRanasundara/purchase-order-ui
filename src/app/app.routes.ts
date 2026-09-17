import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'purchase-orders/new', loadComponent: () => import('./components/purchase-order-form/purchase-order-form').then(m => m.PurchaseOrderForm) },
  { path: '**', redirectTo: 'dashboard' },
];
