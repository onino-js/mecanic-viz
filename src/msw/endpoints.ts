import { http, HttpResponse } from 'msw';

import boxplotData from './data/boxplot.json';
import hardnessTensileCorrelation from './data/hardness.json';
import traction from './data/traction.json';
import radarChartData from './data/radar.json';
import materials from './data/materials.json';
import charts from './data/charts.json';
import tensile from './data/tensile.json';
import youngHeatMap from './data/young-heatmap.json';

export const handlers = [
  http.get('/api/boxplot', () => {
    return HttpResponse.json(boxplotData);
  }),
  http.get('/api/hardness', () => {
    return HttpResponse.json(hardnessTensileCorrelation);
  }),
  http.get('/api/traction', () => {
    return HttpResponse.json(traction);
  }),
  http.get('/api/radar', () => {
    return HttpResponse.json(radarChartData);
  }),
  http.get('/api/materials', () => {
    return HttpResponse.json(materials);
  }),
  http.get('/api/charts', () => {
    return HttpResponse.json(charts);
  }),
  http.get('/api/tensile', () => {
    return HttpResponse.json(tensile);
  }),
  http.get('/api/young-heatmap', () => {
    return HttpResponse.json(youngHeatMap);
  }),
];
