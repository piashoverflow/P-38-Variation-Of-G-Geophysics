import React from 'react';
import { SimulationParams, Language } from '../types';
import { t } from '../utils/i18n';
import { LOCATION_DATA } from '../utils/physics';
import { 
  Sliders, 
  RotateCcw, 
  Globe2, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Disc, 
  RotateCw, 
  Scale, 
  Eye, 
  AlertTriangle 
} from 'lucide-react';

interface ControlPanelProps {
  language: Language;
  params: SimulationParams;
  onChangeParams: (updater: (prev: SimulationParams) => SimulationParams) => void;
  onResetDefaults: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  language,
  params,
  onChangeParams,
  onResetDefaults,
}) => {
  const updateParam = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    onChangeParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-3">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-3">
        {/* Header with Reset Defaults */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-black text-slate-800 tracking-wider uppercase">
              {t(language, 'controlParameters')}
            </h2>
          </div>

          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t(language, 'resetDefaults')}</span>
          </button>
        </div>

        {/* Tab 1: Altitude */}
        {params.preset === 'altitude' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'altitudeH')}</span>
                <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {params.altitudeH} km
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="6400"
                step="50"
                value={params.altitudeH}
                onChange={(e) => updateParam('altitudeH', parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-600">দ্রুত উচ্চতা পরিস্থিতি:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => updateParam('altitudeH', 8.8)}
                  className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg border text-slate-700 font-bold text-left"
                >
                  🏔️ এভারেস্ট (8.8 km)
                </button>
                <button
                  onClick={() => updateParam('altitudeH', 400)}
                  className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg border text-slate-700 font-bold text-left"
                >
                  🛰️ ISS কক্ষপথ (400 km)
                </button>
                <button
                  onClick={() => updateParam('altitudeH', 3200)}
                  className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg border text-slate-700 font-bold text-left"
                >
                  🚀 h = R/2 (3200 km)
                </button>
                <button
                  onClick={() => updateParam('altitudeH', 6371)}
                  className="text-[10px] px-2 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 text-emerald-800 font-bold text-left"
                >
                  ⭐ h = R (6371 km)
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none mt-1">
              <input
                type="checkbox"
                checked={params.useApproximation}
                onChange={(e) => updateParam('useApproximation', e.target.checked)}
                className="accent-emerald-600 rounded"
              />
              <span>সূত্রের তুলনা: g(1 - 2h/R) বনাম g·R²/(R+h)²</span>
            </label>
          </div>
        )}

        {/* Tab 2: Depth */}
        {params.preset === 'depth' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'depthD')}</span>
                <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {params.depthD} km
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="6371"
                step="50"
                value={params.depthD}
                onChange={(e) => updateParam('depthD', parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>ভূপৃষ্ঠ (d=0)</span>
                <span>কেন্দ্র (d=R, g=0)</span>
              </div>
            </div>

            {/* Quick depth presets */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => updateParam('depthD', 12)}
                className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg border text-slate-700 font-bold text-left"
              >
                ⛏️ কোলা খনি (12 km)
              </button>
              <button
                onClick={() => updateParam('depthD', 2900)}
                className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg border text-slate-700 font-bold text-left"
              >
                🌋 গুরুমণ্ডল (2900 km)
              </button>
              <button
                onClick={() => updateParam('depthD', 3185)}
                className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg border text-slate-700 font-bold text-left"
              >
                🎯 d = R/2 (g = g/2)
              </button>
              <button
                onClick={() => updateParam('depthD', 6371)}
                className="text-[10px] px-2 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 text-emerald-800 font-bold text-left"
              >
                🕳️ ভূ-কেন্দ্র (g = 0)
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Earth Shape */}
        {params.preset === 'earth_shape' && (
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-700">{t(language, 'earthLocations')}</span>
            <div className="flex flex-col gap-1.5">
              {(Object.keys(LOCATION_DATA) as Array<keyof typeof LOCATION_DATA>).map((key) => {
                const loc = LOCATION_DATA[key];
                const isSelected = params.selectedLocation === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      updateParam('selectedLocation', key);
                      updateParam('latitudeDeg', loc.lat);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex justify-between items-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{language === 'bn' ? loc.nameBn : loc.nameEn}</span>
                    <span className="font-mono text-[11px] opacity-90">g = {loc.g} m/s²</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Diurnal Rotation */}
        {params.preset === 'diurnal_rotation' && (
          <div className="flex flex-col gap-3">
            {/* Latitude Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'latitudeDeg')}</span>
                <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  λ = {params.latitudeDeg}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="1"
                value={params.latitudeDeg}
                onChange={(e) => updateParam('latitudeDeg', parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>বিষুব (0°)</span>
                <span>ঢাকা (23.8°)</span>
                <span>মেরু (90°)</span>
              </div>
            </div>

            {/* Rotation Multiplier */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'rotationSpeed')}</span>
                <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {params.rotationMultiplier.toFixed(1)}×
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={params.rotationMultiplier}
                onChange={(e) => updateParam('rotationMultiplier', parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* 17x Weightlessness Button */}
            <button
              onClick={() => {
                updateParam('latitudeDeg', 0);
                updateParam('rotationMultiplier', 17.08);
              }}
              className="flex items-center gap-2 p-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-amber-900 text-xs font-bold transition-all text-left"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t(language, 'weightlessnessAlert')}</span>
            </button>
          </div>
        )}

        {/* Tab 5: Cavendish */}
        {params.preset === 'cavendish' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">পরীক্ষাধীন বস্তুর ভর (m):</span>
                <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {params.testMass} kg
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={params.testMass}
                onChange={(e) => updateParam('testMass', parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Visualizer Toggles */}
        <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
          <div className="text-[11px] font-black text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t(language, 'visualizerToggles')}</span>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showVectors}
              onChange={(e) => updateParam('showVectors', e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            <span>{t(language, 'showVectors')}</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showGrid}
              onChange={(e) => updateParam('showGrid', e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            <span>{t(language, 'showGrid')}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
