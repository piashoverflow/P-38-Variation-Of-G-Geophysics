import React, { useRef, useEffect, useState } from 'react';
import { SimulationParams, TelemetryState, Language, AppTheme } from '../types';
import { 
  drawRoundRect, 
  drawVectorArrow, 
  fmtNum, 
  fmtSci, 
  R_EARTH_MEAN, 
  LOCATION_DATA 
} from '../utils/physics';
import { t } from '../utils/i18n';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

interface MotionCanvasProps {
  language: Language;
  theme: AppTheme;
  params: SimulationParams;
  telemetry: TelemetryState;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onToggleSlowMo: () => void;
}

export const MotionCanvas: React.FC<MotionCanvasProps> = ({
  language,
  params,
  telemetry,
  isPlaying,
  onTogglePlay,
  onStep,
  onReset,
  onToggleSlowMo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 520,
  });
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.round(entry.contentRect.width);
      const h = Math.max(480, Math.min(640, Math.round(entry.contentRect.width * 0.58)));
      setContainerDimensions({ width: w, height: h });
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Main Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = containerDimensions;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Grid
    if (params.showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // ==========================================
    // PRESET 1: ALTITUDE (h)
    // ==========================================
    if (params.preset === 'altitude') {
      const earthCenterX = width * 0.35;
      const earthCenterY = height + 100;
      const earthR = height * 0.65;

      // Draw Earth curve
      const earthGrad = ctx.createRadialGradient(earthCenterX, earthCenterY, earthR * 0.2, earthCenterX, earthCenterY, earthR);
      earthGrad.addColorStop(0, '#0369a1');
      earthGrad.addColorStop(0.7, '#0284c7');
      earthGrad.addColorStop(1, '#38bdf8');

      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Earth atmosphere glow
      const atmoGrad = ctx.createRadialGradient(earthCenterX, earthCenterY, earthR, earthCenterX, earthCenterY, earthR + 30);
      atmoGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      atmoGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = atmoGrad;
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthR + 30, 0, Math.PI * 2);
      ctx.fill();

      // Altitude ladder line
      const maxAlt = 6400; // km
      const altNorm = params.altitudeH / maxAlt;
      const maxPixH = height * 0.6;
      const probeY = (earthCenterY - earthR) - altNorm * maxPixH;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(earthCenterX, earthCenterY - earthR);
      ctx.lineTo(earthCenterX, probeY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Surface marker
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(language === 'bn' ? 'ভূপৃষ্ঠ (h = 0, g = 9.81 m/s²)' : 'Surface (h = 0, g = 9.81 m/s²)', earthCenterX, earthCenterY - earthR + 25);

      // Probe / Satellite
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(earthCenterX, probeY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Gravity vector arrow (downwards)
      const gVecLen = Math.max(15, (telemetry.currentG / 9.81) * 60);
      drawVectorArrow(ctx, earthCenterX, probeY, earthCenterX, probeY + gVecLen, '#22c55e', `g_h = ${fmtNum(telemetry.currentG, 2)} m/s²`, 8);

      // Altitude tag
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText(`h = ${params.altitudeH} km (r = ${params.altitudeH + 6371} km)`, earthCenterX + 16, probeY - 10);
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.fillText(`g হ্রাস পেয়েছে: ${fmtNum(telemetry.percentChange, 1)}%`, earthCenterX + 16, probeY + 12);
    }

    // ==========================================
    // PRESET 2: DEPTH (d)
    // ==========================================
    else if (params.preset === 'depth') {
      const centerX = width * 0.45;
      const centerY = height * 0.5;
      const earthR = Math.min(width, height) * 0.42;

      // Draw Earth Layers
      // Crust / Mantle (outer)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner Core
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthR * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Effective inner sphere (radius r = R - d)
      const depthNorm = Math.min(1, params.depthD / 6371);
      const innerR = earthR * (1 - depthNorm);

      ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Drilling tunnel
      const probeX = centerX;
      const probeY = (centerY - earthR) + depthNorm * earthR;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - earthR);
      ctx.lineTo(centerX, centerY);
      ctx.stroke();

      // Center mark
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '10px Plus Jakarta Sans';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.fillText(language === 'bn' ? 'ভূ-কেন্দ্র (g = 0)' : 'Earth Center (g = 0)', centerX - 8, centerY + 3);

      // Probe
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(probeX, probeY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Gravity vector towards center
      if (innerR > 5) {
        const gLen = Math.max(10, (telemetry.currentG / 9.81) * 50);
        drawVectorArrow(ctx, probeX, probeY, probeX, probeY + gLen, '#22c55e', `g_d = ${fmtNum(telemetry.currentG, 2)}m/s²`, 7);
      }

      // Explanatory note
      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.textAlign = 'left';
      ctx.fillText('Shell Theorem: শুধু অভ্যন্তরীণ গোলক (r = R - d) আকর্ষণ করে', centerX + earthR + 15, centerY - 20);
      ctx.fillStyle = '#fef08a';
      ctx.fillText(`g_d = g(1 - d/R) = ${fmtNum(telemetry.currentG, 2)} m/s²`, centerX + earthR + 15, centerY + 5);
    }

    // ==========================================
    // PRESET 3: EARTH SHAPE (Oblate Spheroid)
    // ==========================================
    else if (params.preset === 'earth_shape') {
      const centerX = width * 0.45;
      const centerY = height * 0.5;
      const a = Math.min(width, height) * 0.42; // Equatorial
      const b = a * 0.94; // Polar (exaggerated for clear visualization)

      // Draw Spheroid
      const earthGrad = ctx.createRadialGradient(centerX, centerY, b * 0.2, centerX, centerY, a);
      earthGrad.addColorStop(0, '#0369a1');
      earthGrad.addColorStop(0.8, '#0284c7');
      earthGrad.addColorStop(1, '#38bdf8');

      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, a, b, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Polar Axis Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - b - 25);
      ctx.lineTo(centerX, centerY + b + 25);
      ctx.stroke();

      // Equatorial Axis Line
      ctx.beginPath();
      ctx.moveTo(centerX - a - 25, centerY);
      ctx.lineTo(centerX + a + 25, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Polar Marker
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(centerX, centerY - b, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('উত্তর মেরু (Pole)', centerX, centerY - b - 12);
      ctx.fillText('R_p = 6357 km | g_p = 9.832 m/s²', centerX, centerY - b - 26);

      // Equatorial Marker
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(centerX + a, centerY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('বিষুব রেখা (Equator)', centerX + a + 12, centerY);
      ctx.fillText('R_e = 6378 km | g_e = 9.780 m/s²', centerX + a + 12, centerY + 16);

      // Difference summary
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('R_e - R_p ≈ 21 km  ➔  g ∝ 1/R²  ➔  g_p > g_e', centerX, height - 30);
    }

    // ==========================================
    // PRESET 4: DIURNAL ROTATION
    // ==========================================
    else if (params.preset === 'diurnal_rotation') {
      const centerX = width * 0.45;
      const centerY = height * 0.5;
      const earthR = Math.min(width, height) * 0.38;

      // Draw Rotating Earth
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Spin Axis
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - earthR - 35);
      ctx.lineTo(centerX, centerY + earthR + 35);
      ctx.stroke();

      // Rotation arrow on top
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY - earthR - 20, 16, Math.PI, Math.PI * 2);
      ctx.stroke();

      // Location at latitude lambda
      const latRad = (params.latitudeDeg * Math.PI) / 180;
      const pX = centerX + earthR * Math.cos(latRad);
      const pY = centerY - earthR * Math.sin(latRad);

      // Radius line
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.5)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(pX, pY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Latitude arc
      ctx.strokeStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35, 0, -latRad, true);
      ctx.stroke();
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.fillStyle = '#fef08a';
      ctx.fillText(`λ=${params.latitudeDeg}°`, centerX + 42, centerY - 12);

      // Particle
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(pX, pY, 7, 0, Math.PI * 2);
      ctx.fill();

      // True Gravity Vector (towards center)
      drawVectorArrow(ctx, pX, pY, pX - 45 * Math.cos(latRad), pY + 45 * Math.sin(latRad), '#38bdf8', 'g', 7);

      // Centrifugal Vector (outward horizontally from axis)
      const acLen = Math.min(50, Math.max(5, (telemetry.centrifugalAcc / 9.81) * 60));
      drawVectorArrow(ctx, pX, pY, pX + acLen, pY, '#f43f5e', 'a_c', 7);

      // Weightlessness condition notice
      if (params.latitudeDeg === 0 && params.rotationMultiplier >= 17) {
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 14px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ ১৭ গুণ আহ্নিক গতি: বিষুব রেখায় আপাত ওজন শূন্য (Weightlessness)!', centerX, 40);
      }
    }

    // ==========================================
    // PRESET 5: CAVENDISH & RELATION
    // ==========================================
    else if (params.preset === 'cavendish') {
      const centerX = width * 0.5;
      const centerY = height * 0.5;

      // Draw Earth and surface mass
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(centerX, centerY + 100, 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Earth mass label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('পৃথিবীর ভর M ≈ 5.972 × 10²⁴ kg', centerX, centerY + 130);
      ctx.fillText('ব্যাসার্ধ R ≈ 6371 km', centerX, centerY + 155);

      // Mass m on surface
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(centerX, centerY - 80, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.stroke();

      drawVectorArrow(ctx, centerX, centerY - 80, centerX, centerY - 20, '#22c55e', `mg = ${fmtNum(telemetry.apparentWeight, 1)} N`, 8);

      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 14px JetBrains Mono';
      ctx.fillText('g = GM / R² = 4/3 π G ρ R', centerX, centerY - 120);
    }
  }, [containerDimensions, params, telemetry, language]);

  return (
    <div ref={containerRef} className="flex-1 w-full flex flex-col gap-3">
      {/* Simulation Canvas Container */}
      <div className="relative w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-md">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: `${containerDimensions.height}px` }}
          className="block"
        />

        {/* Top-Right Canvas Overlay Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 transition-colors"
            title={isFullScreen ? t(language, 'exitFullScreen') : t(language, 'fullScreen')}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Control Deck Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? t(language, 'pause') : t(language, 'play')}</span>
          </button>

          <button
            onClick={onStep}
            disabled={isPlaying}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{t(language, 'step')}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t(language, 'reset')}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSlowMo}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              params.slowMo
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            🐢 {t(language, 'slowMo')}
          </button>
        </div>
      </div>
    </div>
  );
};
