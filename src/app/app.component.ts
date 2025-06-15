import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MaterialSelectorComponent } from './components/material-selector/material-selector.component';
import { ChartSelectorComponent } from './components/chart-selector/chart-selector.component';
import { WelcomeModalComponent } from './components/welcome-modal/welcome-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    // RouterLink,
    // RouterLinkActive,
    MaterialSelectorComponent,
    ChartSelectorComponent,
    WelcomeModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'mecanics';
}
