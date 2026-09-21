import React, { useRef, useEffect } from 'react';
import { SimulationParams, TelemetryState, Language } from '../types';
import { t } from '../utils/i18n';
import { fmtNum, fmtSci, R_EARTH_MEAN } from '../utils/physics';
import { 
  Activity, 
  BarChart3, 
  Zap, 
  Scale, 
  Globe2, 
  Clock 
} from 'lucide-react';

interface AnalyticsPanelProps {
  language: Language;
  params: SimulationParams;
  telemetry: TelemetryState;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  language,
  params,
  telemetry,
}) => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(35, 10);
    ctx.lineTo(35, h - 20);
    ctx.lineTo(w - 10, h - 20);
    ctx.stroke();

    ctx.font = '9px JetBrains Mono';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('g (m/s²)', 40, 18);

    if (params.preset === 'altitude') {
      ctx.fillText('h (km)', w - 35, h - 6);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= w - 45; x += 3) {
        const altKm = (x / (w - 45)) * 6400;
        const gVal = 9.81 * Math.pow(6371 / (6371 + altKm), 2);
        const yPix = (h - 20) - (gVal / 9.81) * (h - 35);
        if (x === 0) ctx.moveTo(35 + x, yPix);
        else ctx.lineTo(35 + x, yPix);
      }
      ctx.stroke();

      // Current point
      const ptX = 35 + (params.altitudeH / 6400) * (w - 45);
      const ptY = (h - 20) - (telemetry.currentG / 9.81) * (h - 35);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(Math.min(w - 12, ptX), Math.max(12, ptY), 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (params.preset === 'depth') {
      ctx.fillText('d (km)', w - 35, h - 6);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(35, (h - 20) - (h - 35));
      ctx.lineTo(w - 10, h - 20);
      ctx.stroke();

      // Current point
      const ptX = 35 + (params.depthD / 6371) * (w - 45);
      const ptY = (h - 20) - (telemetry.currentG / 9.81) * (h - 35);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(Math.min(w - 12, ptX), Math.max(12, ptY), 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (params.preset === 'diurnal_rotation') {
      ctx.fillText('λ (deg)', w - 35, h - 6);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= w - 45; x += 3) {
        const deg = (x / (w - 45)) * 90;
        const rad = (deg * Math.PI) / 180;
        const omega = params.rotationMultiplier * 7.292e-5;
        const ac = omega * omega * (6371 * 1e3) * Math.cos(rad) * Math.cos(rad);
        const gVal = Math.max(0, 9.81 - ac);
        const yPix = (h - 20) - (gVal / 9.81) * (h - 35);
        if (x === 0) ctx.moveTo(35 + x, yPix);
        else ctx.lineTo(35 + x, yPix);
      }
      ctx.stroke();
    }
  }, [params, telemetry]);

  return (
    <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-3">
      {/* 1. Live Telemetry Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'telemetryTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'currentG')}</span>
            <span className="font-mono font-black text-emerald-700 text-base mt-0.5">
              {fmtNum(telemetry.currentG, 3)} m/s²
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'percentChange')}</span>
            <span className="font-mono font-black text-rose-700 text-base mt-0.5">
              -{fmtNum(telemetry.percentChange, 2)}%
            </span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col col-span-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'apparentWeight')} (m = {params.testMass} kg)</span>
            <span className="font-mono font-black text-slate-900 text-sm mt-0.5">
              W = {fmtNum(telemetry.apparentWeight, 1)} N ({fmtNum(telemetry.apparentWeight / 9.81, 1)} kg-wt)
            </span>
          </div>

          {params.preset === 'diurnal_rotation' && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'centrifugalAcc')}</span>
                <span className="font-mono font-black text-amber-700 text-xs mt-0.5">
                  {fmtNum(telemetry.centrifugalAcc, 3)} m/s²
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'dayLength')}</span>
                <span className="font-mono font-black text-indigo-700 text-xs mt-0.5">
                  {fmtNum(telemetry.dayLengthHours, 1)} ঘণ্টা
                </span>
              </div>
            </>
          )}
        </div>

        {/* Real-time Graph */}
        <div className="mt-1 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            <span>g বনাম দূরত্ব / অক্ষাংশ গ্রাফ</span>
          </span>
          <div className="w-full h-28 bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
            <canvas ref={chartCanvasRef} width={320} height={112} className="w-full h-full block" />
          </div>
        </div>
      </div>

      {/* 2. Step-by-Step Mathematical Equations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="p-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'exactMathTitle')}
          </h3>
        </div>

        {params.preset === 'altitude' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-emerald-800 font-black block">সঠিক সূত্র: g_h = g · [R / (R + h)]²</span>
              <p className="text-slate-600 font-medium">
                = 9.81 × [6371 / ({6371 + params.altitudeH})]²
              </p>
              <p className="text-slate-900 font-black text-sm">
                = {fmtNum(telemetry.currentG, 3)} m/s²
              </p>
            </div>
            {params.useApproximation && (
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <span className="text-amber-800 font-bold block">আসন্ন সূত্র (h ≪ R): g_h ≈ g(1 - 2h/R)</span>
                <p className="text-amber-900 font-medium text-[11px]">
                  = 9.81 × (1 - 2×{params.altitudeH}/6371) = {fmtNum(telemetry.approxG || 0, 3)} m/s²
                </p>
                <span className="text-[10px] text-rose-700 font-sans block">
                  *উচ্চতা বৃদ্ধি পেলে আসন্ন সূত্রের ত্রুটি বাড়ে।
                </span>
              </div>
            )}
          </div>
        )}

        {params.preset === 'depth' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-emerald-800 font-black block">গভীরতায় সূত্র: g_d = g (1 - d/R)</span>
              <p className="text-slate-600 font-medium">
                = 9.81 × (1 - {params.depthD} / 6371)
              </p>
              <p className="text-slate-900 font-black text-sm">
                = {fmtNum(telemetry.currentG, 3)} m/s²
              </p>
              <span className="text-[11px] text-sky-800 font-sans block mt-1">
                g_d এর পরিবর্তন সম্পূর্ণ রৈখিক (Linear)। কেন্দ্রে d = R হলে g = 0।
              </span>
            </div>
          </div>
        )}

        {params.preset === 'earth_shape' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-emerald-800 font-black block">g = GM / R²  ➔  g ∝ 1/R²</span>
              <p className="text-slate-600 font-medium">
                মেরু ব্যাসার্ধ R_p = 6357 km  ➔  g_p = 9.832 m/s²
              </p>
              <p className="text-slate-600 font-medium">
                বিষুব ব্যাসার্ধ R_e = 6378 km  ➔  g_e = 9.780 m/s²
              </p>
              <span className="text-[11px] text-emerald-800 font-sans block font-bold mt-1">
                মেরু অঞ্চলে g এর মান সর্বাধিক এবং বিষুব রেখায় সর্বনিম্ন।
              </span>
            </div>
          </div>
        )}

        {params.preset === 'diurnal_rotation' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-emerald-800 font-black block">g_λ = g - ω² R cos²λ</span>
              <p className="text-slate-600 font-medium">
                অপকেন্দ্র ত্বরণ a_c = ω² R cosλ
              </p>
              <p className="text-slate-900 font-black text-sm">
                কার্যকর g_λ = {fmtNum(telemetry.currentG, 3)} m/s²
              </p>
              {params.rotationMultiplier >= 17 && params.latitudeDeg === 0 && (
                <div className="text-[11px] text-rose-800 bg-rose-50 p-1.5 rounded border border-rose-200 font-sans font-bold">
                  ω = 17ω₀  ➔  বিষুব রেখায় আপাত ওজন W = 0!
                </div>
              )}
            </div>
          </div>
        )}

        {params.preset === 'cavendish' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-emerald-800 font-black block">g = GM / R² = ⁴⁄₃ π G ρ R</span>
              <p className="text-slate-600 font-medium">
                M = g R² / G = 5.972 × 10²⁴ kg
              </p>
              <p className="text-slate-600 font-medium">
                গড় ঘনত্ব ρ = 3g / (4π G R) ≈ 5515 kg/m³
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
