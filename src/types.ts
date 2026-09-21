export type P38Mode = 'altitude_depth' | 'earth_shape' | 'earth_rotation' | 'g_determination';

export interface AltitudeDepthParams {
  altitudeKm: number; // 0 to 20,000 km
  depthKm: number; // 0 to 6,371 km
  probeMode: 'altitude' | 'depth';
  objectMass: number; // kg
  pendulumLength: number; // m
}

export interface EarthShapeParams {
  latitudeDeg: number; // 0 to 90 degrees
  objectMass: number;
}

export interface EarthRotationParams {
  omegaMultiplier: number; // 1x (normal) to 20x
  latitudeDeg: number; // 0 to 90 degrees
  objectMass: number;
}

export interface DeterminationParams {
  pendulumLength: number; // 0.5 to 2.5 m
  amplitudeDeg: number; // 2 to 10 deg
  locationPreset: 'equator' | 'dhaka' | 'pole' | 'everest';
}
