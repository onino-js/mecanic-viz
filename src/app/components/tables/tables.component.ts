import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TractionTableComponent } from '../traction-table/traction-table.component';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, TractionTableComponent],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
})
export class TablesComponent {}
