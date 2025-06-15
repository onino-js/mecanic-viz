import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { TractionChartComponent } from './traction-chart/traction-chart.component';
import { RadarChartComponent } from './radar-chart/radar-chart.component';
import { BoxplotChartComponent } from './boxplot-chart/boxplot-chart.component';
import { TensileChartComponent } from './tensile-chart/tensile-chart.component';
import { HardnessChartComponent } from './hardness-chart/hardness-chart.component';
import { HeatmapChartComponent } from './heatmap-chart/heatmap-chart.component';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    CommonModule,
    TractionChartComponent,
    RadarChartComponent,
    BoxplotChartComponent,
    TensileChartComponent,
    HardnessChartComponent,
    HeatmapChartComponent,
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public chartType$!: Observable<string>;

  ngOnInit(): void {
    this.chartType$ = this.route.queryParams.pipe(
      map((params) => params['chart'] || 'traction')
    );
  }
}
