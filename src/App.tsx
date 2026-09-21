import React, { useState } from 'react';
import { Header } from './components/Header';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlDeck } from './components/ControlDeck';
import { MathFormulaOverlay } from './components/MathFormulaOverlay';
import { P38Mode, AltitudeDepthParams, EarthShapeParams, EarthRotationParams, DeterminationParams } from './types';

export default function App() {
  const [mode, setMode] = useState<P38Mode>('altitude_depth');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [showMath, setShowMath] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'bn'>('bn');
  const [time, setTime] = useState<number>(0);

  const [altitudeDepthParams, setAltitudeDepthParams] = useState<AltitudeDepthParams>({
    altitudeKm: 500,
    depthKm: 1000,
    probeMode: 'altitude',
    objectMass: 20,
    pendulumLength: 1.0,
  });

  const [earthShapeParams, setEarthShapeParams] = useState<EarthShapeParams>({
    latitudeDeg: 23.8, // Dhaka
    objectMass: 50,
  });

  const [earthRotationParams, setEarthRotationParams] = useState<EarthRotationParams>({
    omegaMultiplier: 1,
    latitudeDeg: 0,
    objectMass: 60,
  });

  const [determinationParams, setDeterminationParams] = useState<DeterminationParams>({
    pendulumLength: 1.0,
    amplitudeDeg: 4.0,
    locationPreset: 'dhaka',
  });

  const handleReset = () => {
    setTime(0);
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      <Header
        mode={mode}
        setMode={setMode}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        onReset={handleReset}
        speed={speed}
        setSpeed={setSpeed}
        showMath={showMath}
        setShowMath={setShowMath}
        lang={lang}
        setLang={setLang}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 flex flex-col items-center justify-center">
          <SimulationCanvas
            mode={mode}
            isRunning={isRunning}
            speed={speed}
            altitudeDepthParams={altitudeDepthParams}
            earthShapeParams={earthShapeParams}
            earthRotationParams={earthRotationParams}
            determinationParams={determinationParams}
            time={time}
            setTime={setTime}
            lang={lang}
          />
        </div>

        <div className="lg:col-span-1">
          <ControlDeck
            mode={mode}
            altitudeDepthParams={altitudeDepthParams}
            setAltitudeDepthParams={setAltitudeDepthParams}
            earthShapeParams={earthShapeParams}
            setEarthShapeParams={setEarthShapeParams}
            earthRotationParams={earthRotationParams}
            setEarthRotationParams={setEarthRotationParams}
            determinationParams={determinationParams}
            setDeterminationParams={setDeterminationParams}
            lang={lang}
          />
        </div>
      </main>

      <MathFormulaOverlay
        mode={mode}
        show={showMath}
        onClose={() => setShowMath(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-900 px-4 py-2.5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-slate-400">P-38 Earth Geophysics & g Variation Lab</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Developed by</span>
            <span className="font-bold text-emerald-400">Shamsuddin Piash</span>
            <span>• BUET ME '25</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
