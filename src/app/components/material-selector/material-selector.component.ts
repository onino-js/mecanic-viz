import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

interface Material {
  id: string;
  name: string;
}

@Component({
  selector: 'app-material-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './material-selector.component.html',
  styleUrls: ['./material-selector.component.scss'],
})
export class MaterialSelectorComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  materials$!: Observable<Material[]>;
  private allMaterialIds: string[] = [];
  public selectedMaterials = new Set<string>();

  ngOnInit(): void {
    this.materials$ = this.http.get<Material[]>('/api/materials').pipe(
      tap((materials) => {
        this.allMaterialIds = materials.map((m) => m.id);
        // Initialize from URL or default to all selected
        this.route.queryParams.subscribe((params) => {
          const materialsFromUrl = params['material'];
          if (materialsFromUrl) {
            this.selectedMaterials = new Set(materialsFromUrl.split(','));
          } else {
            // Default: select all
            this.selectedMaterials = new Set(this.allMaterialIds);
            this.updateUrl();
          }
        });
      })
    );
  }

  toggleMaterial(id: string): void {
    if (this.selectedMaterials.has(id)) {
      this.selectedMaterials.delete(id);
    } else {
      this.selectedMaterials.add(id);
    }
    this.updateUrl();
  }

  toggleAll(): void {
    if (this.areAllSelected()) {
      this.selectedMaterials.clear();
    } else {
      this.selectedMaterials = new Set(this.allMaterialIds);
    }
    this.updateUrl();
  }

  isSelected(id: string): boolean {
    return this.selectedMaterials.has(id);
  }

  areAllSelected(): boolean {
    return this.selectedMaterials.size === this.allMaterialIds.length;
  }

  private updateUrl(): void {
    const materials = Array.from(this.selectedMaterials);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        material: materials.length > 0 ? materials.join(',') : null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
