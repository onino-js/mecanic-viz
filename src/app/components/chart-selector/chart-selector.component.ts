import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, map, tap } from 'rxjs';

interface Chart {
  id: string;
  name: string;
}

@Component({
  selector: 'app-chart-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chart-selector.component.html',
  styleUrls: ['./chart-selector.component.scss'],
})
export class ChartSelectorComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  charts$!: Observable<Chart[]>;
  selectedChart: string = 'traction';

  ngOnInit(): void {
    this.charts$ = this.http.get<Chart[]>('/api/charts');

    this.route.queryParams
      .pipe(
        tap((params) => {
          if (!params['chart']) {
            this.selectedChart = 'traction';
            this.updateUrl(this.selectedChart);
          } else {
            this.selectedChart = params['chart'];
          }
        })
      )
      .subscribe();
  }

  onChartChange(event: Event): void {
    const chart = (event.target as HTMLSelectElement).value;
    this.updateUrl(chart);
  }

  private updateUrl(chart: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { chart },
      queryParamsHandling: 'merge',
    });
  }
}
