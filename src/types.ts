export type Language = 'bn' | 'en';
export type AppTheme = 'clean_bright' | 'midnight';
export type PresetMode = 'altitude' | 'depth' | 'earth_shape' | 'diurnal_rotation' | 'cavendish';

export interface SimulationParams {
  preset: PresetMode;
  theme: AppTheme;

  // 1. Altitude
  altitudeH: number; // km (0 to 6400 km)
  useApproximation: boolean; // compare exact vs (1 - 2h/R)

  // 2. Depth
  depthD: number; // km (0 to 6371 km)

  // 3. Earth Shape
  selectedLocation: 'pole' | 'dhaka' | 'equator' | 'everest';
  
  // 4. Diurnal Rotation
  latitudeDeg: number; // 0 to 90 degrees
  rotationMultiplier: number; // 1 to 20x (17x is weightlessness at equator)

  // 5. General & Cavendish
  testMass: number; // kg (default 50 kg)
  earthMassScale: number; // 1.0 (5.972e24 kg)
  
  // Visual Toggles
  showVectors: boolean;
  showEarthCutaway: boolean;
  showEquatorialBulge: boolean;
  showGrid: boolean;
  slowMo: boolean;
}

export interface TelemetryState {
  elapsedTime: number;
  currentG: number; // m/s^2
  surfaceG: number; // m/s^2 (9.81)
  approxG?: number; // m/s^2
  deltaG: number; // m/s^2
  percentChange: number; // %
  apparentWeight: number; // N
  currentRadius: number; // km
  centrifugalAcc: number; // m/s^2
  criticalRotationMultiple: number; // ~17.08x
  dayLengthHours: number; // hours
  latitudeRad: number;
}
