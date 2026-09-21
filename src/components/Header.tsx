import React from 'react';
import { Play, Pause, RotateCcw, Globe, Mountain, Compass, Timer, Sparkles } from 'lucide-react';
import { P38Mode } from '../types';

interface HeaderProps {
  mode: P38Mode;
  setMode: (mode: P38Mode) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean | ((prev: boolean) => boolean)) => void;
  onReset: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  showMath: boolean;
  setShowMath: (show: boolean | ((prev: boolean) => boolean)) => void;
  lang: 'en' | 'bn';
  setLang: (lang: 'en' | 'bn') => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  isRunning,
  setIsRunning,
  onReset,
  speed,
  setSpeed,
  showMath,
  setShowMath,
  lang,
  setLang,
}) => {
  const modes = [
    {
      id: 'altitude_depth' as P38Mode,
      labelEn: 'Altitude (h) & Depth (d)',
      labelBn: 'উচ্চতা (h) ও গভীরতা (d)',
      icon: Mountain,
    },
    {
      id: 'earth_shape' as P38Mode,
      labelEn: "Earth's Ellipsoid Shape",
      labelBn: 'পৃথিবীর আকার (আহ্নিক ব্যাসার্ধ)',
      icon: Globe,
    },
    {
      id: 'earth_rotation' as P38Mode,
      labelEn: 'Diurnal Rotation & Latitude',
      labelBn: 'আহ্নিক গতি ও অক্ষাংশ (λ)',
      icon: Compass,
    },
    {
      id: 'g_determination' as P38Mode,
      labelEn: 'Pendulum Determination',
      labelBn: 'সরল দোলকে g নির্ণয়',
      icon: Timer,
    },
  ];

  return (
    <header className="bg-slate-900/90 border-b border-cyan-500/20 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Globe className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold font-mono bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                P-38
              </span>
              <h1 className="text-lg font-bold text-white tracking-wide">
                {lang === 'bn' ? 'অভিকর্ষজ ত্বরণ (g)-এর মান ও বিভিন্ন কারণে পরিবর্তন' : 'Acceleration Due to Gravity (g) & Geophysics Variations'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {lang === 'bn'
                ? 'উচ্চতার পরিবর্তন (h) • ভূ-অভ্যন্তরে গভীরতা (d) • পৃথিবীর আকার ও ব্যাসার্ধ • ঘূর্ণন ও অক্ষাংশ প্রভাব'
                : "Altitude (h) • Depth (d) • Oblate Earth Shape • Diurnal Rotation (g_λ = g - ω²R cos²λ)"}
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto max-w-full">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? m.labelBn : m.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Global Controls & Language Switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning((p) => !p)}
            className={`p-2 rounded-lg text-white font-medium flex items-center gap-1 transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20'
            }`}
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowMath((p) => !p)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showMath
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-500/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'bn' ? 'গাণিতিক সূত্র' : 'Math Formulas'}</span>
          </button>

          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-400"
          >
            {lang === 'en' ? 'বাংলা' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
};
