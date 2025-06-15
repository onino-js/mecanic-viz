import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TensileChartComponent } from './tensile-chart.component';
import { TensileResponse } from '../../../core/interfaces';

describe('TensileChartComponent', () => {
  let component: TensileChartComponent;
  let fixture: ComponentFixture<TensileChartComponent>;

  const mockTensileResponse: TensileResponse = {
    steel: { values: [380, 390, 405] },
    aluminum: { values: [240, 250, 255] },
  };

  const mockActivatedRoute = {
    queryParams: of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TensileChartComponent, HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(TensileChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('transformData', () => {
    it('should transform data for a single material', () => {
      const traces = (component as any).transformData(
        mockTensileResponse,
        'steel'
      );
      expect(traces.length).toBe(1);
      expect(traces[0].name).toBe('Steel');
      expect(traces[0].x).toEqual([380, 390, 405]);
      expect(traces[0].type).toBe('histogram');
    });

    it('should transform data for all materials if none is selected', () => {
      const traces = (component as any).transformData(
        mockTensileResponse,
        undefined
      );
      expect(traces.length).toBe(2);
      expect(traces[0].name).toBe('Steel');
      expect(traces[1].name).toBe('Aluminum');
    });

    it('should return an empty array for an unknown material', () => {
      const traces = (component as any).transformData(
        mockTensileResponse,
        'unknown'
      );
      expect(traces.length).toBe(0);
    });
  });
});
