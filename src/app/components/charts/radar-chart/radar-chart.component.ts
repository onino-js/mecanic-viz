import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PlotlyModule } from 'angular-plotly.js';
import { Observable, map, switchMap } from 'rxjs';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyTrace, RadarResponse } from '../../../core/interfaces';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [CommonModule, PlotlyModule],
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss'],
})
export class RadarChartComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  public graphData$!: Observable<PlotlyTrace[]>;
  public graphLayout: any = {
    title: { text: 'Material Mechanical Profile' },
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 1000], // Will be adjusted dynamically if needed
        gridcolor: '#444',
        linecolor: '#555',
      },
      angularaxis: {
        gridcolor: '#444',
        linecolor: '#555',
      },
    },
    showlegend: true,
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
          .get<RadarResponse>('/api/radar')
          .pipe(
            map((response) => this.transformData(response, params['material']))
          )
      )
    );
  }

  private transformData(
    response: RadarResponse,
    selectedMaterialsStr: string | undefined
  ): PlotlyTrace[] {
    const traces: PlotlyTrace[] = [];
    const { labels, datasets } = response;

    const selectedIds = selectedMaterialsStr
      ? selectedMaterialsStr.split(',')
      : Object.keys(datasets);

    selectedIds.forEach((id) => {
      if (datasets[id]) {
        const materialData = datasets[id];
        traces.push({
          type: 'scatterpolar',
          r: materialData.values,
          theta: labels,
          fill: 'toself',
          name: materialData.name,
        });
      }
    });

    return traces;
  }
}
