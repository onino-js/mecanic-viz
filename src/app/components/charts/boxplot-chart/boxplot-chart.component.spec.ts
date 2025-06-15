import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BoxplotChartComponent } from './boxplot-chart.component';

const mockBoxplotData = {
  materials: {
    steel: {
      name: 'Steel',
      properties: {
        yield: { q1: 1, median: 2, q3: 3, min: 0, max: 4 },
      },
    },
    aluminium: {
      name: 'Aluminium',
      properties: {
        yield: { q1: 5, median: 6, q3: 7, min: 4, max: 8 },
      },
    },
  },
};

describe('BoxplotChartComponent', () => {
  let component: BoxplotChartComponent;
  let fixture: ComponentFixture<BoxplotChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BoxplotChartComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoxplotChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('transformData', () => {
    it('should group properties for a single selected material', () => {
      const result = (component as any).transformData(mockBoxplotData, 'steel');
      expect(result.length).toBe(1);
      const yieldProp = result[0];
      expect(yieldProp.name).toBe('yield');
      expect(yieldProp.x).toEqual(['Steel']);
      expect(yieldProp.q1).toEqual([1]);
    });

    it('should group properties for all materials if none is selected', () => {
      const result = (component as any).transformData(
        mockBoxplotData,
        undefined
      );
      expect(result.length).toBe(1);
      const yieldProp = result[0];
      expect(yieldProp.name).toBe('yield');
      expect(yieldProp.x).toEqual(['Steel', 'Aluminium']);
      expect(yieldProp.q1).toEqual([1, 5]);
      expect(yieldProp.median).toEqual([2, 6]);
    });
  });
});
