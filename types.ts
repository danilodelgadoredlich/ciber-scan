export enum AppState {
  IDLE = 'IDLE',
  CAMERA = 'CAMERA',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface AnalysisResponse {
  rawText: string;
  items: string[];
}

export interface CameraDevice {
  deviceId: string;
  label: string;
}