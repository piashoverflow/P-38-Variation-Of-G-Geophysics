import React, { useState, useEffect, useRef } from 'react';
import { Language, PresetMode, AppTheme, SimulationParams, TelemetryState } from './types';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { MotionCanvas } from './components/MotionCanvas';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { TheoryModal } from './components/TheoryModal';
import { 
  R_EARTH_MEAN, 
  OMEGA_EARTH_0, 
  G_SURFACE_STANDARD, 
  LOCATION_DATA 
} from './utils/physics';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [theme, setTheme] = useState<AppTheme>('clean_bright');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const initialParams: SimulationParams = {
    preset: 'altitude',
    theme: 'clean_bright',
    altitudeH: 400, // 400 km (ISS orbit)
    useApproximation: true,
    depthD: 1000,
    selectedLocation: 'dhaka',
    latitudeDeg: 23.81,
    rotationMultiplier: 1.0,
    testMass: 60,
    earthMassScale: 1.0,
    showVectors: true,
    showEarthCutaway: true,
    showEquatorialBulge: true,
    showGrid: true,
    slowMo: false,
  };

  const [params, setParams] = useState<SimulationParams>(initialParams);

  // Compute Telemetry
  const computeTelemetry = (p: SimulationParams): TelemetryState => {
    const g0 = G_SURFACE_STANDARD;
    let curG = g0;
    let approxG = undefined;
    let curR = R_EARTH_MEAN;
    let ac = 0;

    if (p.preset === 'altitude') {
      curR = R_EARTH_MEAN + p.altitudeH;
      curG = g0 * Math.pow(R_EARTH_MEAN / curR, 2);
      approxG = Math.max(0, g0 * (1 - (2 * p.altitudeH) / R_EARTH_MEAN));
    } else if (p.preset === 'depth') {
      curR = Math.max(0, R_EARTH_MEAN - p.depthD);
      curG = g0 * (curR / R_EARTH_MEAN);
    } else if (p.preset === 'earth_shape') {
      const loc = LOCATION_DATA[p.selectedLocation];
      curG = loc.g;
      curR = loc.r;
    } else if (p.preset === 'diurnal_rotation') {
      const latRad = (p.latitudeDeg * Math.PI) / 180;
      const omega = p.rotationMultiplier * OMEGA_EARTH_0;
      ac = omega * omega * (R_EARTH_MEAN * 1000) * Math.cos(latRad);
      curG = Math.max(0, g0 - ac * Math.cos(latRad));
    } else if (p.preset === 'cavendish') {
      curG = g0;
    }

    const delta = g0 - curG;
    const percent = (delta / g0) * 100;
    const weight = p.testMass * curG;
    const latRad = (p.latitudeDeg * Math.PI) / 180;

    return {
      elapsedTime: 0,
      currentG: curG,
      surfaceG: g0,
      approxG,
      deltaG: delta,
      percentChange: percent,
      apparentWeight: weight,
      currentRadius: curR,
      centrifugalAcc: ac,
      criticalRotationMultiple: 17.08,
      dayLengthHours: 24 / (p.rotationMultiplier || 1),
      latitudeRad: latRad,
    };
  };

  const [telemetry, setTelemetry] = useState<TelemetryState>(() => computeTelemetry(initialParams));

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const handleReset = () => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    setTelemetry(computeTelemetry(params));
  };

  const handleResetDefaults = () => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    const restored = { ...initialParams, preset: params.preset };
    setParams(restored);
    setTelemetry(computeTelemetry(restored));
  };

  const handlePresetSelect = (newPreset: PresetMode) => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    const next = { ...params, preset: newPreset };
    setParams(next);
    setTelemetry(computeTelemetry(next));
  };

  const handleStep = () => {
    setTelemetry((prev) => ({ ...prev, elapsedTime: prev.elapsedTime + 0.1 }));
  };

  const handleParamsUpdate = (updater: (prev: SimulationParams) => SimulationParams) => {
    setParams((prev) => {
      const next = updater(prev);
      setTelemetry(computeTelemetry(next));
      return next;
    });
  };

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setTelemetry((prev) => ({
        ...prev,
        elapsedTime: prev.elapsedTime + dt * (params.slowMo ? 0.25 : 1.0),
      }));

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, params]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-slate-800">
      {/* 1. Udvash Header */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        preset={params.preset}
        onSelectPreset={handlePresetSelect}
        onOpenTheory={() => setIsModalOpen(true)}
        onReset={handleReset}
      />

      {/* 2. Main 3-Column Workspace */}
      <main className="max-w-[1780px] w-full mx-auto p-3 sm:p-4 flex-1 flex flex-col lg:flex-row gap-4 items-start">
        <ControlPanel
          language={language}
          params={params}
          onChangeParams={handleParamsUpdate}
          onResetDefaults={handleResetDefaults}
        />

        <MotionCanvas
          language={language}
          theme={theme}
          params={params}
          telemetry={telemetry}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
          onStep={handleStep}
          onReset={handleReset}
          onToggleSlowMo={() => setParams((prev) => ({ ...prev, slowMo: !prev.slowMo }))}
        />

        <AnalyticsPanel
          language={language}
          params={params}
          telemetry={telemetry}
        />
      </main>

      {/* 3. Theory Modal */}
      <TheoryModal
        language={language}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
