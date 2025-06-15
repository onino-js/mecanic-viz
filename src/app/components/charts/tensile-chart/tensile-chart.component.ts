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
    xaxis: { title: { text: 'Tensile Strength (MPa)' } },
    yaxis: { title: { text: 'Frequency' } },
    barmode: 'overlay',
    showlegend: true,
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
    selectedMaterial: string | undefined
  ): PlotlyTrace[] {
    const traces: PlotlyTrace[] = [];
    let materialsToProcess: TensileResponse = {};

    if (selectedMaterial) {
      if (response[selectedMaterial]) {
        materialsToProcess = {
          [selectedMaterial]: response[selectedMaterial],
        };
      } else {
        return []; // Retourne un tableau vide si le matériau sélectionné n'existe pas
      }
    } else {
      materialsToProcess = response;
    }

    for (const materialKey in materialsToProcess) {
      if (
        Object.prototype.hasOwnProperty.call(materialsToProcess, materialKey)
      ) {
        const materialData = materialsToProcess[materialKey];
        traces.push({
          x: materialData.values,
          type: 'histogram',
          name: materialKey.charAt(0).toUpperCase() + materialKey.slice(1),
          opacity: 0.75,
        });
      }
    }
    return traces;
  }
}
