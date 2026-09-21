import React from 'react';
import { P38Mode, AltitudeDepthParams, EarthShapeParams, EarthRotationParams, DeterminationParams } from '../types';
import { Sliders, Mountain, Globe, Compass, Timer } from 'lucide-react';

interface ControlDeckProps {
  mode: P38Mode;
  altitudeDepthParams: AltitudeDepthParams;
  setAltitudeDepthParams: React.Dispatch<React.SetStateAction<AltitudeDepthParams>>;
  earthShapeParams: EarthShapeParams;
  setEarthShapeParams: React.Dispatch<React.SetStateAction<EarthShapeParams>>;
  earthRotationParams: EarthRotationParams;
  setEarthRotationParams: React.Dispatch<React.SetStateAction<EarthRotationParams>>;
  determinationParams: DeterminationParams;
  setDeterminationParams: React.Dispatch<React.SetStateAction<DeterminationParams>>;
  lang: 'en' | 'bn';
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  mode,
  altitudeDepthParams,
  setAltitudeDepthParams,
  earthShapeParams,
  setEarthShapeParams,
  earthRotationParams,
  setEarthRotationParams,
  determinationParams,
  setDeterminationParams,
  lang,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
        <Sliders className="w-4 h-4 text-emerald-400" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          {lang === 'bn' ? 'প্যারামিটার ও প্রিসেট' : 'Parameters & Presets'}
        </h2>
      </div>

      {/* MODE 1: ALTITUDE & DEPTH */}
      {mode === 'altitude_depth' && (
        <div className="space-y-4 text-xs">
          {/* Probe Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setAltitudeDepthParams((p) => ({ ...p, probeMode: 'altitude' }))}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                altitudeDepthParams.probeMode === 'altitude'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'bn' ? 'উচ্চতা (h > 0)' : 'Altitude (h)'}
            </button>
            <button
              onClick={() => setAltitudeDepthParams((p) => ({ ...p, probeMode: 'depth' }))}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                altitudeDepthParams.probeMode === 'depth'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'bn' ? 'ভূ-অভ্যন্তরে গভীরতা (d)' : 'Depth (d)'}
            </button>
          </div>

          {altitudeDepthParams.probeMode === 'altitude' ? (
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>{lang === 'bn' ? 'উচ্চতা h (km)' : 'Altitude h (km)'}</span>
                <span className="font-mono text-emerald-400">{altitudeDepthParams.altitudeKm} km</span>
              </div>
              <input
                type="range"
                min="0"
                max="15000"
                step="50"
                value={altitudeDepthParams.altitudeKm}
                onChange={(e) =>
                  setAltitudeDepthParams((p) => ({ ...p, altitudeKm: parseFloat(e.target.value) }))
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {[
                  { name: 'Mt. Everest', h: 8.85 },
                  { name: 'Airliner', h: 12 },
                  { name: 'ISS Orbit', h: 408 },
                  { name: 'GPS Satellite', h: 20200 },
                ].map((pre) => (
                  <button
                    key={pre.name}
                    onClick={() => setAltitudeDepthParams((p) => ({ ...p, altitudeKm: pre.h }))}
                    className="p-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[10px] text-slate-300 text-left font-mono"
                  >
                    {pre.name} ({pre.h} km)
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>{lang === 'bn' ? 'গভীরতা d (km)' : 'Depth d (km)'}</span>
                <span className="font-mono text-emerald-400">{altitudeDepthParams.depthKm} km</span>
              </div>
              <input
                type="range"
                min="0"
                max="6371"
                step="50"
                value={altitudeDepthParams.depthKm}
                onChange={(e) =>
                  setAltitudeDepthParams((p) => ({ ...p, depthKm: parseFloat(e.target.value) }))
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {[
                  { name: 'Kola Superdeep', d: 12.2 },
                  { name: 'Crust Boundary', d: 35 },
                  { name: 'Mantle Center', d: 2900 },
                  { name: 'Earth Center', d: 6371 },
                ].map((pre) => (
                  <button
                    key={pre.name}
                    onClick={() => setAltitudeDepthParams((p) => ({ ...p, depthKm: pre.d }))}
                    className="p-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[10px] text-slate-300 text-left font-mono"
                  >
                    {pre.name} ({pre.d} km)
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'পরীক্ষামূলক ভর (kg)' : 'Test Mass (kg)'}</span>
              <span className="font-mono text-cyan-400">{altitudeDepthParams.objectMass} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={altitudeDepthParams.objectMass}
              onChange={(e) =>
                setAltitudeDepthParams((p) => ({ ...p, objectMass: parseFloat(e.target.value) }))
              }
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* MODE 2: EARTH SHAPE */}
      {mode === 'earth_shape' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'অক্ষাংশ λ (Latitude Degrees)' : 'Latitude λ (Degrees)'}</span>
              <span className="font-mono text-emerald-400">{earthShapeParams.latitudeDeg.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="0.5"
              value={earthShapeParams.latitudeDeg}
              onChange={(e) =>
                setEarthShapeParams((p) => ({ ...p, latitudeDeg: parseFloat(e.target.value) }))
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <span className="text-slate-400 font-medium block mb-1.5">
              {lang === 'bn' ? 'ভৌগোলিক প্রিসেট:' : 'Geographic Presets:'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { name: 'Equator (বিষুব)', lat: 0 },
                { name: 'Dhaka (ঢাকা)', lat: 23.8 },
                { name: 'London (লন্ডন)', lat: 51.5 },
                { name: 'North Pole (মেরু)', lat: 90 },
              ].map((pre) => (
                <button
                  key={pre.name}
                  onClick={() => setEarthShapeParams((p) => ({ ...p, latitudeDeg: pre.lat }))}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[11px] text-slate-300 text-left font-mono"
                >
                  {pre.name} ({pre.lat}°)
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: EARTH ROTATION */}
      {mode === 'earth_rotation' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'আহ্নিক গতির গুণক (ω Multiplier)' : 'Earth Spin Multiplier (ω)'}</span>
              <span className="font-mono text-emerald-400">{earthRotationParams.omegaMultiplier}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={earthRotationParams.omegaMultiplier}
              onChange={(e) =>
                setEarthRotationParams((p) => ({ ...p, omegaMultiplier: parseInt(e.target.value, 10) }))
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>1x (Real)</span>
              <span>10x</span>
              <span className="text-rose-400 font-bold">17x (Zero-G)</span>
              <span>20x</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'অক্ষাংশ λ (Latitude)' : 'Latitude λ'}</span>
              <span className="font-mono text-cyan-400">{earthRotationParams.latitudeDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="1"
              value={earthRotationParams.latitudeDeg}
              onChange={(e) =>
                setEarthRotationParams((p) => ({ ...p, latitudeDeg: parseFloat(e.target.value) }))
              }
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <button
            onClick={() =>
              setEarthRotationParams({
                omegaMultiplier: 17,
                latitudeDeg: 0,
                objectMass: 50,
              })
            }
            className="w-full py-2 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/50 rounded-lg font-bold text-xs transition-all shadow-md shadow-rose-500/10"
          >
            {lang === 'bn' ? '🚀 ১৭ গুণ গতিতে বিষুবরেখায় ওজনহীনতা পরীক্ষা' : '🚀 Test 17x Weightlessness Condition'}
          </button>
        </div>
      )}

      {/* MODE 4: DETERMINATION */}
      {mode === 'g_determination' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'দোলকের দৈর্ঘ্য L (m)' : 'Pendulum Length L (m)'}</span>
              <span className="font-mono text-emerald-400">{determinationParams.pendulumLength.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.05"
              value={determinationParams.pendulumLength}
              onChange={(e) =>
                setDeterminationParams((p) => ({ ...p, pendulumLength: parseFloat(e.target.value) }))
              }
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <span className="text-slate-400 font-medium block mb-1.5">
              {lang === 'bn' ? 'ভৌগোলিক স্থান নির্বাচন:' : 'Bench Location Preset:'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'equator' as const, name: 'Equator (9.780)' },
                { id: 'dhaka' as const, name: 'Dhaka (9.789)' },
                { id: 'everest' as const, name: 'Everest (9.765)' },
                { id: 'pole' as const, name: 'Pole (9.832)' },
              ].map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setDeterminationParams((p) => ({ ...p, locationPreset: loc.id }))}
                  className={`p-1.5 rounded border text-[11px] font-mono text-left ${
                    determinationParams.locationPreset === loc.id
                      ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50 font-bold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
