import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, map, tap } from 'rxjs';

interface Material {
  id: string;
  name: string;
}

@Component({
  selector: 'app-material-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './material-selector.component.html',
  styleUrl: './material-selector.component.scss',
})
export class MaterialSelectorComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  materials$!: Observable<Material[]>;
  selectedMaterial: string = 'all';

  ngOnInit(): void {
    this.materials$ = this.http
      .get<Material[]>('/api/materials')
      .pipe(map((materials) => [{ id: 'all', name: 'All' }, ...materials]));

    // Ce code gère la synchronisation du matériau sélectionné avec les paramètres de l'URL
    this.route.queryParams
      .pipe(
        // tap() permet d'effectuer des actions secondaires sans modifier les données
        tap((params) => {
          // Si un paramètre 'material' existe dans l'URL
          if (params['material']) {
            // On met à jour le matériau sélectionné dans le composant
            this.selectedMaterial = params['material'];
          } else {
            // Sinon, on réinitialise avec la valeur par défaut
            this.selectedMaterial = 'all';
          }
        })
      )
      // On souscrit pour activer l'Observable et déclencher le traitement
      .subscribe();
  }

  onMaterialChange(event: Event): void {
    const material = (event.target as HTMLSelectElement).value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { material: material === 'all' ? null : material },
      queryParamsHandling: 'merge',
    });
  }
}
