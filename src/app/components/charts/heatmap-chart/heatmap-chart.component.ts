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
    selectedMaterialsStr: string | undefined
  ): PlotlyTrace[] {
    const allMaterialsData = response;

    const selectedIds = selectedMaterialsStr
      ? selectedMaterialsStr.split(',')
      : Object.keys(allMaterialsData);

    const data: HeatmapData = {
      x: allMaterialsData[selectedIds[0]]?.x || [],
      y: selectedIds.map((id) => allMaterialsData[id]?.y[0]).filter((y) => y),
      z: selectedIds.map((id) => allMaterialsData[id]?.z[0]).filter((z) => z),
    };

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
