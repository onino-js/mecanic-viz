import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RadarChartComponent } from './radar-chart.component';

const mockRadarData = {
  labels: ['A', 'B', 'C'],
  datasets: {
    steel: {
      name: 'Steel',
      values: [1, 2, 3],
    },
    aluminium: {
      name: 'Aluminium',
      values: [4, 5, 6],
    },
  },
};

describe('RadarChartComponent', () => {
  let component: RadarChartComponent;
  let fixture: ComponentFixture<RadarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        RadarChartComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RadarChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('transformData', () => {
    it('should transform data for a single selected material', () => {
      const result = (component as any).transformData(mockRadarData, 'steel');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Steel');
      expect(result[0].r).toEqual([1, 2, 3]);
      expect(result[0].theta).toEqual(['A', 'B', 'C']);
    });

    it('should transform data for all materials if none is selected', () => {
      const result = (component as any).transformData(mockRadarData, undefined);
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Steel');
      expect(result[1].name).toBe('Aluminium');
    });

    it('should return an empty array for an unknown material', () => {
      const result = (component as any).transformData(mockRadarData, 'unknown');
      expect(result.length).toBe(0);
    });
  });
});
