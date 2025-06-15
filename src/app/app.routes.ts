import { Routes } from '@angular/router';
import { ChartsComponent } from './components/charts/charts.component';
import { TablesComponent } from './components/tables/tables.component';

export const routes: Routes = [
  { path: 'charts', component: ChartsComponent },
  { path: 'tables', component: TablesComponent },
  { path: '', redirectTo: '/charts', pathMatch: 'full' },
];
