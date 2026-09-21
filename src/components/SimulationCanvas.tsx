import React, { useRef, useEffect } from 'react';
import { P38Mode, AltitudeDepthParams, EarthShapeParams, EarthRotationParams, DeterminationParams } from '../types';

interface SimulationCanvasProps {
  mode: P38Mode;
  isRunning: boolean;
  speed: number;
  altitudeDepthParams: AltitudeDepthParams;
  earthShapeParams: EarthShapeParams;
  earthRotationParams: EarthRotationParams;
  determinationParams: DeterminationParams;
  time: number;
  setTime: (updater: (prev: number) => number) => void;
  lang: 'en' | 'bn';
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  mode,
  isRunning,
  speed,
  altitudeDepthParams,
  earthShapeParams,
  earthRotationParams,
  determinationParams,
  time,
  setTime,
  lang,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1) * speed;
      lastTime = now;

      if (isRunning) {
        setTime((t) => t + dt);
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dark geophysics backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#060a12');
      bgGrad.addColorStop(1, '#0d1522');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (mode === 'altitude_depth') {
        renderAltitudeDepth(ctx, width, height, altitudeDepthParams, lang);
      } else if (mode === 'earth_shape') {
        renderEarthShape(ctx, width, height, earthShapeParams, lang);
      } else if (mode === 'earth_rotation') {
        renderEarthRotation(ctx, width, height, time, earthRotationParams, lang);
      } else if (mode === 'g_determination') {
        renderPendulumDetermination(ctx, width, height, time, determinationParams, lang);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mode, isRunning, speed, altitudeDepthParams, earthShapeParams, earthRotationParams, determinationParams, time, lang, setTime]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        width={860}
        height={540}
        className="w-full max-w-4xl h-auto rounded-2xl shadow-2xl border border-slate-800 bg-[#080d1a]"
      />
    </div>
  );
};

// =========================================================================
// MODE 1: ALTITUDE (h) & DEPTH (d) WITH REAL-TIME g(r) CURVE
// =========================================================================
function renderAltitudeDepth(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: AltitudeDepthParams,
  lang: 'en' | 'bn'
) {
  const R_EARTH_KM = 6371;
  const G0 = 9.81;

  // Compute g at current probe position
  let currentR_km = R_EARTH_KM;
  let gValue = G0;

  if (p.probeMode === 'altitude') {
    currentR_km = R_EARTH_KM + p.altitudeKm;
    gValue = G0 * Math.pow(R_EARTH_KM / (R_EARTH_KM + p.altitudeKm), 2);
  } else {
    currentR_km = Math.max(0, R_EARTH_KM - p.depthKm);
    gValue = G0 * (1 - p.depthKm / R_EARTH_KM);
  }

  // Weight W = m * g
  const weight = p.objectMass * gValue;
  // Pendulum period: T = 2 * pi * sqrt(L / g)
  const pendulumT = gValue > 0.01 ? 2 * Math.PI * Math.sqrt(p.pendulumLength / gValue) : Infinity;

  // Title
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'উচ্চতা (h) ও গভীরতায় (d) অভিকর্ষজ ত্বরণ g-এর পরিবর্তন'
      : "Variation of g at Altitude (h) and Depth (d) Below Earth's Surface",
    width / 2,
    30
  );

  // Left Section: Earth Visualizer & Drill Core / Elevator Tower
  const eCenterX = width * 0.28;
  const eCenterY = height * 0.54;
  const eRadiusPx = 130;

  // Atmosphere glow
  const atmosGrad = ctx.createRadialGradient(eCenterX, eCenterY, eRadiusPx, eCenterX, eCenterY, eRadiusPx + 28);
  atmosGrad.addColorStop(0, 'rgba(56, 189, 248, 0.3)');
  atmosGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
  ctx.fillStyle = atmosGrad;
  ctx.beginPath();
  ctx.arc(eCenterX, eCenterY, eRadiusPx + 28, 0, Math.PI * 2);
  ctx.fill();

  // Mantle & Crust
  const earthGrad = ctx.createRadialGradient(eCenterX, eCenterY, 20, eCenterX, eCenterY, eRadiusPx);
  earthGrad.addColorStop(0, '#f97316'); // Outer core
  earthGrad.addColorStop(0.35, '#b45309'); // Mantle
  earthGrad.addColorStop(0.85, '#065f46'); // Continents
  earthGrad.addColorStop(1, '#0284c7'); // Ocean
  ctx.fillStyle = earthGrad;
  ctx.beginPath();
  ctx.arc(eCenterX, eCenterY, eRadiusPx, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inner Core
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(eCenterX, eCenterY, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Core (Center)', eCenterX, eCenterY + 3);

  // Drill borehole / Space stalk line (vertical through center)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(eCenterX, eCenterY);
  ctx.lineTo(eCenterX, eCenterY - eRadiusPx - 90);
  ctx.stroke();
  ctx.setLineDash([]);

  // Probe Position on vertical axis
  let probeY = eCenterY - eRadiusPx; // Surface default
  if (p.probeMode === 'altitude') {
    const frac = Math.min(p.altitudeKm / 15000, 1.0);
    probeY = eCenterY - eRadiusPx - frac * 85;
  } else {
    const frac = Math.min(p.depthKm / R_EARTH_KM, 1.0);
    probeY = eCenterY - eRadiusPx + frac * eRadiusPx;
  }

  // Draw Probe Capsule
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(eCenterX, probeY, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Probe readout tag
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`g = ${gValue.toFixed(3)} m/s²`, eCenterX + 14, probeY + 4);

  // Surface Marker Label
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px "Space Grotesk", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(lang === 'bn' ? 'পৃষ্ঠ (Surface: g = 9.81)' : 'Surface (g = 9.81)', eCenterX - 10, eCenterY - eRadiusPx - 4);
  ctx.fillText(lang === 'bn' ? 'কেন্দ্র (Center: g = 0)' : 'Center (g = 0)', eCenterX - 10, eCenterY + 14);

  // ==========================================
  // Right Section: Real-time g(r) Graph
  // ==========================================
  const gGraphX = width * 0.54;
  const gGraphY = height * 0.15;
  const gGraphW = width * 0.41;
  const gGraphH = height * 0.52;

  // Graph background
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.beginPath();
  ctx.roundRect(gGraphX, gGraphY, gGraphW, gGraphH, 12);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Graph Axes
  const originX = gGraphX + 45;
  const originY = gGraphY + gGraphH - 35;
  const plotW = gGraphW - 60;
  const plotH = gGraphH - 60;

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + plotW, originY); // x axis (r)
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX, originY - plotH); // y axis (g)
  ctx.stroke();

  // Axes Labels
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('g (m/s²)', originX - 6, originY - plotH + 5);
  ctx.fillText('9.81', originX - 6, originY - plotH + 15);
  ctx.fillText('0', originX - 6, originY);

  ctx.textAlign = 'center';
  ctx.fillText('r = 0 (Center)', originX, originY + 16);
  const rSurfPlotX = originX + plotW * 0.4;
  ctx.fillText('R (Surface)', rSurfPlotX, originY + 16);
  ctx.fillText('2R', originX + plotW * 0.8, originY + 16);

  // Plot Curve: Interior r <= R (Linear: g = g0 * r / R)
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  const maxGPx = plotH * 0.85;
  ctx.lineTo(rSurfPlotX, originY - maxGPx);
  ctx.stroke();

  // Plot Curve: Exterior r > R (Inverse square: g = g0 * (R/r)^2)
  ctx.strokeStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(rSurfPlotX, originY - maxGPx);
  for (let px = rSurfPlotX; px <= originX + plotW; px += 2) {
    const rRatio = 1 + ((px - rSurfPlotX) / (plotW * 0.4));
    const gExt = maxGPx / (rRatio * rRatio);
    ctx.lineTo(px, originY - gExt);
  }
  ctx.stroke();

  // Current probe point on the curve
  let probePlotX = rSurfPlotX;
  if (p.probeMode === 'altitude') {
    probePlotX = rSurfPlotX + (p.altitudeKm / R_EARTH_KM) * (plotW * 0.4);
  } else {
    probePlotX = originX + (1 - p.depthKm / R_EARTH_KM) * (plotW * 0.4);
  }
  probePlotX = Math.min(originX + plotW, Math.max(originX, probePlotX));
  const probePlotY = originY - (gValue / G0) * maxGPx;

  // Pulsating dot on curve
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(probePlotX, probePlotY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Bottom Telemetry Dashboard
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.05, height - 85, width * 0.9, 70, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    `Radius from Center: r = ${currentR_km.toFixed(0)} km  |  Effective g = ${gValue.toFixed(3)} m/s²`,
    width * 0.08,
    height - 62
  );

  ctx.fillStyle = '#f8fafc';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.fillText(
    lang === 'bn'
      ? `বস্তুর আপাত ওজন W = mg = ${weight.toFixed(2)} N (ভর ${p.objectMass} kg)  •  সরল দোলকের পর্যায়কাল T = ${pendulumT === Infinity ? '∞' : pendulumT.toFixed(2) + ' s'}`
      : `Apparent Weight W = mg = ${weight.toFixed(2)} N (Mass ${p.objectMass} kg)  •  Pendulum Period T = ${pendulumT === Infinity ? '∞' : pendulumT.toFixed(2) + ' s'} (L = ${p.pendulumLength} m)`,
    width * 0.08,
    height - 42
  );

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillText(
    p.probeMode === 'altitude'
      ? `Exact Formula: g_h = g · R² / (R + h)²  ≈  g · (1 - 2h/R)`
      : `Depth Formula: g_d = g · (1 - d / R)  [Linear drop to zero at core]`,
    width * 0.08,
    height - 24
  );
}

// =========================================================================
// MODE 2: EARTH SHAPE & LATITUDE VARIATION
// =========================================================================
function renderEarthShape(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: EarthShapeParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'পৃথিবীর আকারের জন্য g-এর পরিবর্তন (অভিগত গোলক / Oblate Spheroid)'
      : "Variation of g Due to Earth's Ellipsoidal Shape (Equatorial Bulge)",
    width / 2,
    30
  );

  const centerX = width * 0.4;
  const centerY = height * 0.52;

  // Exaggerated Oblate Ellipse: a (Equator) = 175px, b (Pole) = 145px
  const aPx = 175;
  const bPx = 145;

  // Earth Ellipse Body
  const earthGrad = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, aPx);
  earthGrad.addColorStop(0, '#1e3a8a');
  earthGrad.addColorStop(0.7, '#0284c7');
  earthGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = earthGrad;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, aPx, bPx, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Equator & Polar Axes lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  // Equatorial Axis
  ctx.moveTo(centerX - aPx - 20, centerY);
  ctx.lineTo(centerX + aPx + 20, centerY);
  // Polar Axis
  ctx.moveTo(centerX, centerY - bPx - 20);
  ctx.lineTo(centerX, centerY + bPx + 20);
  ctx.stroke();

  // Labels on axes
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('North Pole (উঃ মেরু)', centerX, centerY - bPx - 26);
  ctx.fillText('South Pole (দঃ মেরু)', centerX, centerY + bPx + 32);
  ctx.textAlign = 'left';
  ctx.fillText('Equator (বিষুব)', centerX + aPx + 24, centerY + 4);

  // Current Latitude angle line
  const rad = (p.latitudeDeg * Math.PI) / 180;
  // Point on ellipse: x = a*cos(th), y = -b*sin(th)
  const probeX = centerX + aPx * Math.cos(rad);
  const probeY = centerY - bPx * Math.sin(rad);

  // Draw angle line from center
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(probeX, probeY);
  ctx.stroke();

  // Latitude arc
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 40, 0, -rad, true);
  ctx.stroke();
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.fillText(`λ = ${p.latitudeDeg.toFixed(1)}°`, centerX + 48, centerY - 14);

  // Probe marker at surface
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(probeX, probeY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Mathematical values for Earth radii and g
  // R_e = 6378 km, R_p = 6357 km
  const rCurrentKm = Math.sqrt(
    (Math.pow(6378, 2) * Math.pow(6357, 2)) /
      (Math.pow(6378, 2) * Math.pow(Math.sin(rad), 2) + Math.pow(6357, 2) * Math.pow(Math.cos(rad), 2))
  );
  // g(lambda) due to shape alone: g = GM / R^2
  const gShape = 9.7803 * Math.pow(6378 / rCurrentKm, 2);

  // Right Side Information Card
  const cardX = width * 0.68;
  const cardY = height * 0.18;
  const cardW = width * 0.28;
  const cardH = height * 0.58;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(lang === 'bn' ? 'তুলনামূলক তথ্য:' : 'Comparative Geodesy:', cardX + 16, cardY + 28);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '11px "JetBrains Mono", monospace';
  const lines = [
    `R_equator = 6,378 km`,
    `g_equator = 9.780 m/s²`,
    ``,
    `R_pole = 6,357 km`,
    `g_pole = 9.832 m/s²`,
    ``,
    `ΔR = 21 km (Bulge)`,
    `g ∝ 1 / R²`,
    ``,
    `At λ = ${p.latitudeDeg.toFixed(1)}°:`,
    `R(λ) ≈ ${rCurrentKm.toFixed(1)} km`,
    `g(λ) ≈ ${gShape.toFixed(3)} m/s²`,
  ];

  lines.forEach((line, idx) => {
    ctx.fillText(line, cardX + 16, cardY + 54 + idx * 17);
  });

  // Bottom note
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? 'কারণ: পৃথিবী সম্পূর্ণ গোলক নয়, বরং মেরু অঞ্চলে কিছুটা চ্যাপ্টা। ফলে মেরু অঞ্চলের ব্যাসার্ধ কম হওয়ায় g-এর মান সবচেয়ে বেশি!'
      : "Explanation: Earth is an oblate spheroid. Because Polar radius R_p < Equatorial radius R_e, g is maximum at the poles.",
    width * 0.1,
    height - 34
  );
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(
    lang === 'bn' ? 'ঢাকাতে (λ ≈ 23.8° N): g ≈ 9.789 m/s²' : 'Dhaka, Bangladesh (λ ≈ 23.8° N): g ≈ 9.789 m/s²',
    width * 0.1,
    height - 18
  );
}

// =========================================================================
// MODE 3: DIURNAL ROTATION & CENTRIFUGAL WEIGHTLESSNESS
// =========================================================================
function renderEarthRotation(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: EarthRotationParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'পৃথিবীর আহ্নিক গতি ও কেন্দ্রবিমুখী বলের কারণে g-এর পরিবর্তন'
      : "Variation of g Due to Earth's Diurnal Rotation (g_λ = g - ω²R cos²λ)",
    width / 2,
    30
  );

  const centerX = width * 0.44;
  const centerY = height * 0.5;
  const radiusPx = 140;

  // Base parameters
  const R_M = 6.371e6;
  const baseOmega = 7.292e-5; // rad/s (1 rev / 24 hr)
  const currentOmega = baseOmega * p.omegaMultiplier;
  const latRad = (p.latitudeDeg * Math.PI) / 180;
  const cosLat = Math.cos(latRad);

  // Apparent g: g_lambda = g - omega^2 * R * cos^2(lambda)
  const g0 = 9.81;
  const centrifugalReduction = Math.pow(currentOmega, 2) * R_M * Math.pow(cosLat, 2);
  const gApparent = Math.max(0, g0 - centrifugalReduction);

  // Rotating Globe
  const spinAngle = time * (p.omegaMultiplier * 0.6);
  ctx.save();
  ctx.translate(centerX, centerY);

  // Sphere body
  const grad = ctx.createRadialGradient(0, 0, 20, 0, 0, radiusPx);
  grad.addColorStop(0, '#0369a1');
  grad.addColorStop(0.8, '#0f172a');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, radiusPx, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Spinning meridian lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 6; i++) {
    const angleOffset = spinAngle + (i * Math.PI) / 3;
    const wE = Math.sin(angleOffset) * radiusPx;
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.abs(wE), radiusPx, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Rotation Axis Arrow
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -radiusPx - 30);
  ctx.lineTo(0, radiusPx + 30);
  ctx.stroke();
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('ω (Spin Axis)', 10, -radiusPx - 15);

  ctx.restore();

  // Test mass on surface at latitude lambda
  const posX = centerX + radiusPx * Math.cos(latRad);
  const posY = centerY - radiusPx * Math.sin(latRad);

  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(posX, posY, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Force vectors at test mass
  // 1. Inward True Gravity vector mg
  const mgLen = 45;
  const gravVx = -mgLen * Math.cos(latRad);
  const gravVy = mgLen * Math.sin(latRad);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(posX, posY);
  ctx.lineTo(posX + gravVx, posY + gravVy);
  ctx.stroke();
  ctx.fillStyle = '#34d399';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillText('mg (True Gravity)', posX + gravVx - 40, posY + gravVy + 14);

  // 2. Outward Horizontal Centrifugal Vector Fc = m * omega^2 * r
  const fcLen = Math.min((centrifugalReduction / g0) * 80, 75);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(posX, posY);
  ctx.lineTo(posX + fcLen, posY);
  ctx.stroke();
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('F_c (Centrifugal)', posX + fcLen + 6, posY + 4);

  // 17x Weightlessness condition notification
  const isZeroG = gApparent <= 0.01;

  // Bottom HUD
  ctx.fillStyle = isZeroG ? 'rgba(239, 68, 68, 0.25)' : 'rgba(15, 23, 42, 0.9)';
  ctx.strokeStyle = isZeroG ? '#ef4444' : '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 76, width * 0.84, 62, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isZeroG ? '#f87171' : '#38bdf8';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    `Earth Rotation Speed: ${p.omegaMultiplier}x  |  Latitude: ${p.latitudeDeg}°  |  Effective g_λ = ${gApparent.toFixed(3)} m/s²`,
    width * 0.1,
    height - 52
  );

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '11px "Space Grotesk", sans-serif';
  if (isZeroG) {
    ctx.fillText(
      lang === 'bn'
        ? '⚠️ ওজনহীনতা অবস্থা! পৃথিবী বর্তমানের প্রায় ১৭ গুণ দ্রুত ঘুরলে বিষুব অঞ্চলে বস্তুর আপাত ওজন সম্পূর্ণ শূন্য হয়ে যাবে!'
        : '⚠️ Weightlessness Achieved! If Earth rotates ~17 times faster (T ≈ 84 min), objects on the equator become weightless!',
      width * 0.1,
      height - 30
    );
  } else {
    ctx.fillText(
      lang === 'bn'
        ? `কেন্দ্রবিমুখী হ্রাসের মান: Δg = ω²R cos²λ = ${centrifugalReduction.toFixed(4)} m/s²`
        : `Centrifugal reduction: Δg = ω²R cos²λ = ${centrifugalReduction.toFixed(4)} m/s²`,
      width * 0.1,
      height - 30
    );
  }
}

// =========================================================================
// MODE 4: SIMPLE PENDULUM DETERMINATION OF g
// =========================================================================
function renderPendulumDetermination(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: DeterminationParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'সরল দোলকের সাহায্যে g-এর মান নির্ণয়: T = 2π√(L/g) ⟹ g = 4π²L / T²'
      : "Determination of g via Simple Pendulum: T = 2π√(L/g) ⟹ g = 4π²L / T²",
    width / 2,
    30
  );

  const pivotX = width * 0.38;
  const pivotY = 80;
  const stringLengthPx = p.pendulumLength * 120;

  // Preset gravities
  const presetGMap = {
    equator: 9.780,
    dhaka: 9.789,
    everest: 9.765,
    pole: 9.832,
  };
  const g = presetGMap[p.locationPreset];

  // Natural angular frequency: omega = sqrt(g / L)
  const omega0 = Math.sqrt(g / p.pendulumLength);
  const maxThetaRad = (p.amplitudeDeg * Math.PI) / 180;
  const theta = maxThetaRad * Math.cos(omega0 * time);

  const bobX = pivotX + stringLengthPx * Math.sin(theta);
  const bobY = pivotY + stringLengthPx * Math.cos(theta);

  // Pivot Support
  ctx.fillStyle = '#475569';
  ctx.fillRect(pivotX - 50, pivotY - 12, 100, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Pendulum String
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  // Brass Bob
  const bobGrad = ctx.createRadialGradient(bobX, bobY, 3, bobX, bobY, 18);
  bobGrad.addColorStop(0, '#fef08a');
  bobGrad.addColorStop(0.6, '#eab308');
  bobGrad.addColorStop(1, '#854d0e');
  ctx.fillStyle = bobGrad;
  ctx.beginPath();
  ctx.arc(bobX, bobY, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Theoretical Period
  const T = 2 * Math.PI * Math.sqrt(p.pendulumLength / g);
  // Computed g from T:
  const calculatedG = (4 * Math.pow(Math.PI, 2) * p.pendulumLength) / Math.pow(T, 2);

  // Digital Lab Telemetry on Right
  const hudX = width * 0.62;
  const hudY = 90;
  const hudW = width * 0.33;
  const hudH = height * 0.66;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(hudX, hudY, hudW, hudH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(lang === 'bn' ? 'ডিজিটাল ল্যাব পরিমাপ:' : 'Digital Laboratory Bench:', hudX + 16, hudY + 28);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '11px "JetBrains Mono", monospace';
  const labData = [
    `Location: ${p.locationPreset.toUpperCase()}`,
    `String Length L: ${p.pendulumLength.toFixed(3)} m`,
    `Amplitude: ${p.amplitudeDeg.toFixed(1)}°`,
    ``,
    `Measured Period T:`,
    `${T.toFixed(4)} s`,
    ``,
    `Calculated Formula:`,
    `g = 4π²L / T²`,
    ``,
    `Calculated g:`,
    `${calculatedG.toFixed(4)} m/s²`,
    ``,
    `Target Benchmark:`,
    `${g.toFixed(4)} m/s²`,
    `Error: 0.00%`,
  ];

  labData.forEach((row, i) => {
    ctx.fillText(row, hudX + 16, hudY + 54 + i * 16);
  });
}
