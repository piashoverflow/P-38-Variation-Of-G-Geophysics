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
  Minimize2,
  Clock
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

    // Subtle Grid
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

    const tTime = telemetry.elapsedTime;

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

      // Vertical guide line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(earthCenterX, earthCenterY - earthR);
      ctx.lineTo(earthCenterX, probeY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Animated Orbiting Research Satellite at Altitude h
      const satOrbitOffset = Math.sin(tTime * 1.2) * (width * 0.18);
      const satX = earthCenterX + satOrbitOffset;

      // Scanning telemetry cone down to Earth
      const beamGrad = ctx.createLinearGradient(satX, probeY, earthCenterX, earthCenterY - earthR);
      beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
      beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0.02)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(satX, probeY);
      ctx.lineTo(earthCenterX - 35, earthCenterY - earthR);
      ctx.lineTo(earthCenterX + 35, earthCenterY - earthR);
      ctx.closePath();
      ctx.fill();

      // Satellite Bus
      ctx.fillStyle = '#0284c7';
      drawRoundRect(ctx, satX - 14, probeY - 9, 28, 18, 4);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Solar Wings
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(satX - 32, probeY - 6, 15, 12);
      ctx.fillRect(satX + 17, probeY - 6, 15, 12);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(satX - 32, probeY - 6, 15, 12);
      ctx.strokeRect(satX + 17, probeY - 6, 15, 12);

      // Flashing Beacon
      const beaconAlpha = 0.5 + 0.5 * Math.sin(tTime * 8);
      ctx.fillStyle = `rgba(239, 68, 68, ${beaconAlpha})`;
      ctx.beginPath();
      ctx.arc(satX, probeY - 12, 3, 0, Math.PI * 2);
      ctx.fill();

      // Gravity vector downward from satellite
      drawVectorArrow(ctx, satX, probeY + 12, satX, probeY + 12 + Math.max(25, (telemetry.currentG / 9.81) * 60), '#ef4444', `g_h = ${fmtNum(telemetry.currentG, 3)} m/s²`, 7);

      // Info Tag
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px JetBrains Mono';
      ctx.fillText(`h = ${params.altitudeH} km (${((params.altitudeH / 6371) * 100).toFixed(1)}% R)`, satX + 38, probeY - 4);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px Plus Jakarta Sans';
      ctx.fillText(`হ্রাস: -${fmtNum(Math.abs(telemetry.percentChange), 1)}%`, satX + 38, probeY + 12);
    }

    // ==========================================
    // PRESET 2: DEPTH (d)
    // ==========================================
    else if (params.preset === 'depth') {
      const centerX = width * 0.45;
      const centerY = height * 0.5;
      const earthR = Math.min(width, height) * 0.38;

      // Outer Earth (crust)
      const crustGrad = ctx.createRadialGradient(centerX, centerY, earthR * 0.6, centerX, centerY, earthR);
      crustGrad.addColorStop(0, '#1e293b');
      crustGrad.addColorStop(0.85, '#0f766e');
      crustGrad.addColorStop(1, '#14b8a6');
      ctx.fillStyle = crustGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Active Effective Mass Sphere (R - d)
      const dNorm = params.depthD / 6371;
      const effR = earthR * (1 - dNorm);

      if (effR > 2) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, effR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Earth Center Core
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('কেন্দ্রে g = 0', centerX, centerY + 18);

      // Subterranean Vertical Shaft
      const shaftWidth = 16;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(centerX - shaftWidth / 2, centerY - earthR, shaftWidth, earthR);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.strokeRect(centerX - shaftWidth / 2, centerY - earthR, shaftWidth, earthR);

      // Drilling Probe at Depth d with subtle vibration
      const probeY = centerY - earthR + dNorm * earthR;
      const vibeX = (Math.sin(tTime * 30) * 1.5);

      // Probe capsule
      ctx.fillStyle = '#f59e0b';
      drawRoundRect(ctx, centerX - 6 + vibeX, probeY - 10, 12, 20, 3);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Spinning drill bit at bottom
      const drillPhase = Math.sin(tTime * 40);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 4 + vibeX, probeY + 10);
      ctx.lineTo(centerX + vibeX, probeY + 16 + drillPhase * 2);
      ctx.lineTo(centerX + 4 + vibeX, probeY + 10);
      ctx.stroke();

      // Cable from surface
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - earthR);
      ctx.lineTo(centerX + vibeX, probeY - 10);
      ctx.stroke();

      // Force Vector towards center
      if (effR > 10) {
        drawVectorArrow(ctx, centerX + 18, probeY, centerX + 18, probeY + Math.max(15, (telemetry.currentG / 9.81) * 50), '#10b981', `g_d = ${fmtNum(telemetry.currentG, 3)} m/s²`, 6);
      }

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText(`গভীরতা d = ${params.depthD} km`, centerX + 35, probeY);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Plus Jakarta Sans';
      ctx.fillText(`বাকি ব্যাসার্ধ r = ${6371 - params.depthD} km`, centerX + 35, probeY + 16);
    }

    // ==========================================
    // PRESET 3: SHAPE OF EARTH (Dual Pendulums)
    // ==========================================
    else if (params.preset === 'earth_shape') {
      const centerX = width * 0.45;
      const centerY = height * 0.52;
      const a = Math.min(width, height) * 0.38; // Equatorial radius (wider)
      const b = a * 0.94; // Polar radius (flattened)

      // Draw Ellipsoid Earth
      ctx.save();
      const oblateGrad = ctx.createRadialGradient(centerX, centerY, b * 0.3, centerX, centerY, a);
      oblateGrad.addColorStop(0, '#0369a1');
      oblateGrad.addColorStop(0.8, '#0284c7');
      oblateGrad.addColorStop(1, '#38bdf8');
      ctx.fillStyle = oblateGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, a, b, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Semi-axes indicators
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.setLineDash([3, 3]);
      // Equator axis
      ctx.beginPath();
      ctx.moveTo(centerX - a, centerY);
      ctx.lineTo(centerX + a, centerY);
      ctx.stroke();
      // Polar axis
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - b);
      ctx.lineTo(centerX, centerY + b);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Dual Pendulum Demonstration: Polar vs Equatorial
      // 1. Polar Pendulum on Top: g = 9.832 m/s^2, T = 2.003s
      const polePivotX = centerX;
      const polePivotY = centerY - b - 50;
      const pendLen = 42;
      const omegaPole = Math.sqrt(9.832 / 1.0); // faster
      const thetaPole = 0.32 * Math.cos(omegaPole * tTime);
      const poleBobX = polePivotX + Math.sin(thetaPole) * pendLen;
      const poleBobY = polePivotY + Math.cos(thetaPole) * pendLen;

      // Polar stand
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(polePivotX - 15, polePivotY);
      ctx.lineTo(polePivotX + 15, polePivotY);
      ctx.stroke();

      // Polar string & bob
      ctx.strokeStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(polePivotX, polePivotY);
      ctx.lineTo(poleBobX, poleBobY);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(poleBobX, poleBobY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('মেরু দোলক (Polar)', polePivotX, polePivotY - 8);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.fillText(`g_pole = 9.832 m/s² (দ্রুত)`, polePivotX, polePivotY + pendLen + 24);

      // 2. Equatorial Pendulum on Right: g = 9.780 m/s^2, T = 2.008s
      const eqPivotX = centerX + a + 45;
      const eqPivotY = centerY - 25;
      const omegaEq = Math.sqrt(9.780 / 1.0); // slower
      const thetaEq = 0.32 * Math.cos(omegaEq * tTime);
      const eqBobX = eqPivotX + Math.sin(thetaEq) * pendLen;
      const eqBobY = eqPivotY + Math.cos(thetaEq) * pendLen;

      ctx.strokeStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(eqPivotX - 15, eqPivotY);
      ctx.lineTo(eqPivotX + 15, eqPivotY);
      ctx.stroke();

      ctx.strokeStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(eqPivotX, eqPivotY);
      ctx.lineTo(eqBobX, eqBobY);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(eqBobX, eqBobY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.fillText('বিষুবীয় দোলক (Equator)', eqPivotX, eqPivotY - 8);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.fillText(`g_eq = 9.780 m/s² (ধীর)`, eqPivotX, eqPivotY + pendLen + 24);
    }

    // ==========================================
    // PRESET 4: DIURNAL ROTATION (ω)
    // ==========================================
    else if (params.preset === 'diurnal_rotation') {
      const centerX = width * 0.45;
      const centerY = height * 0.52;
      const earthR = Math.min(width, height) * 0.36;

      // Rotation angle from simulation time
      const rotAng = tTime * (params.rotationMultiplier * 0.8);

      // Rotating Earth Sphere
      const earthGrad = ctx.createRadialGradient(centerX - earthR * 0.3, centerY - earthR * 0.3, 10, centerX, centerY, earthR);
      earthGrad.addColorStop(0, '#0369a1');
      earthGrad.addColorStop(0.7, '#0284c7');
      earthGrad.addColorStop(1, '#075985');
      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rotating Continent Patches
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, earthR, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = '#15803d';
      for (let c = 0; c < 4; c++) {
        const cAng = rotAng + (c * Math.PI * 2) / 4;
        const cX = centerX + Math.cos(cAng) * (earthR * 0.7);
        const cY = centerY + Math.sin(cAng * 0.6) * (earthR * 0.4);
        ctx.beginPath();
        ctx.ellipse(cX, cY, earthR * 0.35, earthR * 0.2, cAng * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Earth Tilted Axis of Rotation (North-South Pole line)
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - earthR - 35);
      ctx.lineTo(centerX, centerY + earthR + 35);
      ctx.stroke();

      // Rotation arrow on top of axis
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY - earthR - 25, 14, 0, Math.PI * 1.5);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`ω = ${params.rotationMultiplier}×`, centerX + 24, centerY - earthR - 20);

      // Selected Latitude circle
      const radLat = (params.latitudeDeg * Math.PI) / 180;
      const latY = centerY - earthR * Math.sin(radLat);
      const rLatPix = earthR * Math.cos(radLat);

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.ellipse(centerX, latY, rLatPix, rLatPix * 0.25, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Test Object rotating around latitude circle
      const objX = centerX + Math.cos(rotAng) * rLatPix;
      const objY = latY + Math.sin(rotAng) * (rLatPix * 0.25);

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(objX, objY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Centrifugal Force vector pointing outwards horizontally
      const acLen = Math.min(80, (telemetry.centrifugalAcc / 9.81) * 70);
      drawVectorArrow(ctx, objX, objY, objX + (objX >= centerX ? 1 : -1) * Math.max(20, acLen), objY, '#f97316', `a_c = ${fmtNum(telemetry.centrifugalAcc, 3)}m/s²`, 6);

      // Net g' vector pointing down-inward
      drawVectorArrow(ctx, objX, objY, centerX, centerY, '#10b981', `g' = ${fmtNum(telemetry.currentG, 3)}m/s²`, 6);
    }

    // ==========================================
    // PRESET 5: CAVENDISH BALANCE
    // ==========================================
    else if (params.preset === 'cavendish') {
      const centerX = width * 0.45;
      const centerY = height * 0.5;

      // Torsion wire oscillation
      const thetaCav = 0.18 * Math.sin(tTime * 1.5);
      const rodLen = 140;

      // Ceiling mount
      ctx.fillStyle = '#475569';
      ctx.fillRect(centerX - 30, 40, 60, 10);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(centerX - 30, 40, 60, 10);

      // Torsion Quartz Fiber
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX, 50);
      ctx.lineTo(centerX, centerY);
      ctx.stroke();

      // Central Mirror
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(centerX - 4, centerY - 8, 8, 16);

      // Rotating Light Torsion Rod
      const m1X = centerX + Math.cos(thetaCav) * rodLen;
      const m1Y = centerY + Math.sin(thetaCav) * (rodLen * 0.3);
      const m2X = centerX - Math.cos(thetaCav) * rodLen;
      const m2Y = centerY - Math.sin(thetaCav) * (rodLen * 0.3);

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(m1X, m1Y);
      ctx.lineTo(m2X, m2Y);
      ctx.stroke();

      // Small Spheres (m)
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(m1X, m1Y, 10, 0, Math.PI * 2);
      ctx.arc(m2X, m2Y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Large Lead Spheres (M) placed adjacent
      const bigM1X = m1X + 28;
      const bigM1Y = m1Y - 14;
      const bigM2X = m2X - 28;
      const bigM2Y = m2Y + 14;

      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(bigM1X, bigM1Y, 26, 0, Math.PI * 2);
      ctx.arc(bigM2X, bigM2Y, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('M', bigM1X, bigM1Y + 4);
      ctx.fillText('M', bigM2X, bigM2Y + 4);
      ctx.fillText('m', m1X, m1Y + 4);
      ctx.fillText('m', m2X, m2Y + 4);

      // Optical Laser reflection onto calibrated scale
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, centerY + 60);
      ctx.lineTo(centerX, centerY);
      const reflectX = width * 0.78 + Math.tan(thetaCav * 2) * 120;
      ctx.lineTo(reflectX, centerY + 80);
      ctx.stroke();

      // Reflected laser spot
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(reflectX, centerY + 80, 4, 0, Math.PI * 2);
      ctx.fill();

      // Scale
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width * 0.65, centerY + 80);
      ctx.lineTo(width * 0.92, centerY + 80);
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText('আলোকরশ্মি বিচ্যুতি স্কেল (Optical Lever)', width * 0.78, centerY + 105);
    }
  }, [containerDimensions, params, telemetry, language]);

  return (
    <div ref={containerRef} className="flex-1 w-full flex flex-col gap-3">
      {/* Canvas Viewport */}
      <div className="relative w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-md">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: `${containerDimensions.height}px` }}
          className="block"
        />

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

      {/* Control Deck */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? t(language, 'pause') : t(language, 'play')}</span>
          </button>

          <button
            onClick={onStep}
            disabled={isPlaying}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{t(language, 'step')}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200 cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t(language, 'reset')}</span>
          </button>

          <button
            onClick={onToggleSlowMo}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-colors border cursor-pointer ${
              params.slowMo
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t(language, 'slowMo')}</span>
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
          <span>t = {telemetry.elapsedTime.toFixed(1)} s</span>
        </div>
      </div>
    </div>
  );
};
