import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TractionChartComponent } from './traction-chart.component';

const mockTractionData = {
  materials: {
    steel: {
      name: 'Steel',
      tractionCurve: [
        { strain: 0, stress: 0 },
        { strain: 0.1, stress: 100 },
      ],
    },
    aluminium: {
      name: 'Aluminium',
      tractionCurve: [
        { strain: 0, stress: 0 },
        { strain: 0.2, stress: 200 },
      ],
    },
  },
};

describe('TractionChartComponent', () => {
  let component: TractionChartComponent;
  let fixture: ComponentFixture<TractionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TractionChartComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TractionChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('transformData', () => {
    it('should transform data for a single selected material', () => {
      const result = (component as any).transformData(
        mockTractionData,
        'steel'
      );
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Steel');
      expect(result[0].x).toEqual([0, 0.1]);
      expect(result[0].y).toEqual([0, 100]);
    });

    it('should transform data for all materials if none is selected', () => {
      const result = (component as any).transformData(
        mockTractionData,
        undefined
      );
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Steel');
      expect(result[1].name).toBe('Aluminium');
    });

    it('should return an empty array for an unknown material', () => {
      const result = (component as any).transformData(
        mockTractionData,
        'unknown'
      );
      expect(result.length).toBe(0);
    });
  });
});
