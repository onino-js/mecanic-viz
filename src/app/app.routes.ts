import { Routes } from '@angular/router';
import { ChartsComponent } from './components/charts/charts.component';

export const routes: Routes = [
  { path: 'charts', component: ChartsComponent },
  { path: '', redirectTo: '/charts', pathMatch: 'full' },
];
