// Generic
export interface PlotlyTrace {
  x?: (string | number)[];
  y?: (string | number)[];
  z?: (string | number)[][];
  q1?: number[];
  median?: number[];
  q3?: number[];
  lowerfence?: number[];
  upperfence?: number[];
  r?: number[];
  theta?: string[];
  type: 'scatter' | 'box' | 'scatterpolar' | 'histogram' | 'heatmap';
  mode?: 'lines' | 'markers';
  name: string;
  fill?: 'toself';
  opacity?: number;
  colorscale?: string;
}

// For /api/traction
export interface TractionPoint {
  strain: number;
  stress: number;
}

export interface TractionMaterial {
  name: string;
  properties: { [key: string]: number };
  tractionCurve: TractionPoint[];
}

export interface TractionResponse {
  materials: {
    [key: string]: TractionMaterial;
  };
}

// For /api/radar
export interface RadarDataset {
  name: string;
  values: number[];
}

export interface RadarResponse {
  labels: string[];
  datasets: {
    [key: string]: RadarDataset;
  };
}

// For /api/boxplot
export interface BoxplotProperty {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
  unit: string;
}

export interface BoxplotMaterial {
  name: string;
  properties: {
    [key: string]: BoxplotProperty;
  };
}

export interface BoxplotResponse {
  materials: {
    [key: string]: BoxplotMaterial;
  };
}

// For /api/tensile
export interface TensileResponse {
  [key: string]: {
    values: number[];
  };
}

// For /api/hardness
export interface HardnessCorrelationPoint {
  hardness: number;
  tensileStrength: number;
}

export interface HardnessMaterial {
  name: string;
  correlation: HardnessCorrelationPoint[];
}

export interface HardnessResponse {
  materials: {
    [key: string]: HardnessMaterial;
  };
}

// For /api/young-heatmap
export interface HeatmapData {
  x: number[];
  y: string[];
  z: number[][];
}

export interface HeatmapResponse {
  [key: string]: HeatmapData;
}
