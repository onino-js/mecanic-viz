import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PlotlyModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { Observable, map, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  PlotlyTrace,
  HardnessResponse,
  HardnessCorrelationPoint,
} from '../../../core/interfaces';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-hardness-chart',
  standalone: true,
  imports: [CommonModule, PlotlyModule],
  templateUrl: './hardness-chart.component.html',
  styleUrl: './hardness-chart.component.scss',
})
export class HardnessChartComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  public graphData$!: Observable<PlotlyTrace[]>;
  public graphLayout: any = {
    title: { text: 'Hardness vs. Tensile Strength' },
    xaxis: { title: { text: 'Hardness (HV)' }, gridcolor: '#444' },
    yaxis: { title: { text: 'Tensile Strength (MPa)' }, gridcolor: '#444' },
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
          .get<HardnessResponse>('/api/hardness')
          .pipe(
            map((response) => this.transformData(response, params['material']))
          )
      )
    );
  }

  private transformData(
    response: HardnessResponse,
    selectedMaterial: string | undefined
  ): PlotlyTrace[] {
    const traces: PlotlyTrace[] = [];
    const materials = response.materials;

    let materialsToProcess: any = {};
    if (selectedMaterial) {
      if (materials[selectedMaterial]) {
        materialsToProcess = {
          [selectedMaterial]: materials[selectedMaterial],
        };
      } else {
        return [];
      }
    } else {
      materialsToProcess = materials;
    }

    for (const materialKey in materialsToProcess) {
      if (
        Object.prototype.hasOwnProperty.call(materialsToProcess, materialKey)
      ) {
        const materialData = materialsToProcess[materialKey];
        traces.push({
          x: materialData.correlation.map(
            (p: HardnessCorrelationPoint) => p.hardness
          ),
          y: materialData.correlation.map(
            (p: HardnessCorrelationPoint) => p.tensileStrength
          ),
          type: 'scatter',
          mode: 'markers',
          name: materialData.name,
        });
      }
    }
    return traces;
  }
}
