import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PlotlyModule } from 'angular-plotly.js';
import { Observable, map, switchMap } from 'rxjs';
import * as PlotlyJS from 'plotly.js-dist-min';
import { BoxplotResponse, PlotlyTrace } from '../../../core/interfaces';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-boxplot-chart',
  standalone: true,
  imports: [CommonModule, PlotlyModule],
  templateUrl: './boxplot-chart.component.html',
  styleUrls: ['./boxplot-chart.component.scss'],
})
export class BoxplotChartComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  public graphData$!: Observable<PlotlyTrace[]>;
  public graphLayout: any = {
    title: { text: 'Distribution of Mechanical Properties' },
    yaxis: { title: { text: 'Value' }, gridcolor: '#444' },
    xaxis: { gridcolor: '#444' },
    boxmode: 'group',
    showlegend: true,
    legendwidth: 300,
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
          .get<BoxplotResponse>('/api/boxplot')
          .pipe(
            map((response) => this.transformData(response, params['material']))
          )
      )
    );
  }

  private transformData(
    response: BoxplotResponse,
    selectedMaterial: string | undefined
  ): PlotlyTrace[] {
    const materials = response.materials;
    const processedProperties: { [key: string]: PlotlyTrace } = {};

    let materialsToProcess: any = {};
    if (selectedMaterial) {
      if (materials[selectedMaterial]) {
        materialsToProcess = {
          [selectedMaterial]: materials[selectedMaterial],
        };
      }
    } else {
      materialsToProcess = materials;
    }

    for (const materialKey in materialsToProcess) {
      const materialData = materialsToProcess[materialKey];
      for (const propKey in materialData.properties) {
        if (!processedProperties[propKey]) {
          processedProperties[propKey] = {
            type: 'box',
            name: propKey,
            x: [],
            q1: [],
            median: [],
            q3: [],
            lowerfence: [],
            upperfence: [],
          };
        }
        const propData = materialData.properties[propKey];
        processedProperties[propKey].x!.push(materialData.name);
        processedProperties[propKey].q1!.push(propData.q1);
        processedProperties[propKey].median!.push(propData.median);
        processedProperties[propKey].q3!.push(propData.q3);
        processedProperties[propKey].lowerfence!.push(propData.min);
        processedProperties[propKey].upperfence!.push(propData.max);
      }
    }
    return Object.values(processedProperties);
  }
}
