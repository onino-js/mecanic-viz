import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { Observable, map, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  PlotlyTrace,
  HeatmapResponse,
  HeatmapData,
} from '../../../core/interfaces';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-heatmap-chart',
  standalone: true,
  imports: [CommonModule, PlotlyModule],
  templateUrl: './heatmap-chart.component.html',
  styleUrl: './heatmap-chart.component.scss',
})
export class HeatmapChartComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  public graphData$!: Observable<PlotlyTrace[]>;
  public graphLayout: any = {
    title: { text: "Young's Modulus vs. Temperature" },
    xaxis: { title: { text: 'Temperature (°C)' } },
    yaxis: { title: { text: 'Material' } },
    paper_bgcolor: '#2c2c2e',
    plot_bgcolor: '#2c2c2e',
    font: {
      color: '#f5f5f7',
    },
  };

  ngOnInit(): void {
    this.graphData$ = this.route.queryParams.pipe(
      switchMap((params) =>
        this.http
          .get<HeatmapResponse>('/api/young-heatmap')
          .pipe(
            map((response) => this.transformData(response, params['material']))
          )
      )
    );
  }

  private transformData(
    response: HeatmapResponse,
    selectedMaterial: string | undefined
  ): PlotlyTrace[] {
    let data: HeatmapData;

    if (selectedMaterial && response[selectedMaterial]) {
      data = response[selectedMaterial];
    } else {
      // Combine all materials for a comparative heatmap
      const allMaterials = Object.keys(response);
      data = {
        x: response[allMaterials[0]].x,
        y: allMaterials.map((m) => response[m].y[0]),
        z: allMaterials.map((m) => response[m].z[0]),
      };
    }

    const trace: PlotlyTrace = {
      x: data.x,
      y: data.y,
      z: data.z,
      type: 'heatmap',
      colorscale: 'Viridis',
      name: '', // Name is not really used for a single heatmap trace
    };

    return [trace];
  }
}
