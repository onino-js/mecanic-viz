import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { Observable, map, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PlotlyTrace, TractionResponse } from '../../../core/interfaces';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-traction-chart',
  standalone: true,
  imports: [CommonModule, PlotlyModule],
  templateUrl: './traction-chart.component.html',
  styleUrl: './traction-chart.component.scss',
})
export class TractionChartComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  public graphData$!: Observable<PlotlyTrace[]>;
  public graphLayout: any = {
    title: { text: 'Traction Curve - Stress vs. Strain' },
    xaxis: { title: { text: 'Strain' }, gridcolor: '#444' },
    yaxis: { title: { text: 'Stress (MPa)' }, gridcolor: '#444' },
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
          .get<TractionResponse>('/api/traction')
          .pipe(
            map((response) => this.transformData(response, params['material']))
          )
      )
    );
  }

  private transformData(
    response: TractionResponse,
    selectedMaterialsStr: string | undefined
  ): PlotlyTrace[] {
    const traces: PlotlyTrace[] = [];
    const allMaterials = response.materials;
    const materialsToProcess: any = {};

    // If a string exists, split it into an array. Otherwise, use all materials.
    const selectedIds = selectedMaterialsStr
      ? selectedMaterialsStr.split(',')
      : Object.keys(allMaterials);

    selectedIds.forEach((id) => {
      if (allMaterials[id]) {
        const materialData = allMaterials[id];
        traces.push({
          x: materialData.tractionCurve.map(
            (p: { strain: number }) => p.strain
          ),
          y: materialData.tractionCurve.map(
            (p: { stress: number }) => p.stress
          ),
          type: 'scatter',
          mode: 'lines',
          name: materialData.name,
        });
      }
    });

    return traces;
  }
}
