import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { TractionResponse, TractionMaterial } from '../../core/interfaces';

@Component({
  selector: 'app-traction-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traction-table.component.html',
  styleUrls: ['./traction-table.component.scss'],
})
export class TractionTableComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  materials$!: Observable<TractionMaterial[]>;

  ngOnInit(): void {
    this.materials$ = this.route.queryParams.pipe(
      switchMap((params) => {
        const selectedMaterial = params['material'];
        return this.http.get<TractionResponse>('/api/traction').pipe(
          map((response) => {
            const materialsObject = response.materials;
            const materialsArray: TractionMaterial[] = [];

            if (selectedMaterial && materialsObject[selectedMaterial]) {
              const materialData = materialsObject[selectedMaterial];
              materialsArray.push({
                name: materialData.name,
                properties: materialData.properties,
                tractionCurve: materialData.tractionCurve,
              });
            } else {
              for (const key in materialsObject) {
                if (
                  Object.prototype.hasOwnProperty.call(materialsObject, key)
                ) {
                  const materialData = materialsObject[key];
                  materialsArray.push({
                    name: materialData.name,
                    properties: materialData.properties,
                    tractionCurve: materialData.tractionCurve,
                  });
                }
              }
            }
            return materialsArray;
          })
        );
      })
    );
  }
}
