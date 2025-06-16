import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { Observable, map, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PlotlyTrace, TensileResponse } from '../../../core/interfaces';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-tensile-chart',
  standalone: true,
  imports: [CommonModule, PlotlyModule],
  templateUrl: './tensile-chart.component.html',
  styleUrl: './tensile-chart.component.scss',
})
export class TensileChartComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  public graphData$!: Observable<PlotlyTrace[]>;
  public graphLayout = {
    title: { text: 'Tensile Strength Distribution' },
    xaxis: { title: { text: 'Tensile Strength (MPa)' }, gridcolor: '#444' },
    yaxis: { title: { text: 'Frequency' }, gridcolor: '#444' },
    barmode: 'overlay',
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
          .get<TensileResponse>('/api/tensile')
          .pipe(
            map((response) => this.transformData(response, params['material']))
          )
      )
    );
  }

  private transformData(
    response: TensileResponse,
    selectedMaterialsStr: string | undefined
  ): PlotlyTrace[] {
    const traces: PlotlyTrace[] = [];
    const allMaterials = response;

    const selectedIds = selectedMaterialsStr
      ? selectedMaterialsStr.split(',')
      : Object.keys(allMaterials);

    selectedIds.forEach((id) => {
      if (allMaterials[id]) {
        const materialData = allMaterials[id];
        traces.push({
          x: materialData.values,
          type: 'histogram',
          name: id.charAt(0).toUpperCase() + id.slice(1),
          opacity: 0.75,
        });
      }
    });

    return traces;
  }
}
