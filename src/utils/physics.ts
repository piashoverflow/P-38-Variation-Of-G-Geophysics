export const G_UNIVERSAL = 6.67430e-11;
export const R_EARTH_MEAN = 6371; // km
export const R_EARTH_EQUATOR = 6378.137; // km
export const R_EARTH_POLE = 6356.752; // km
export const M_EARTH = 5.972e24; // kg
export const OMEGA_EARTH_0 = 7.292115e-5; // rad/s (24h diurnal rotation)
export const G_SURFACE_STANDARD = 9.80665; // m/s^2

export function fmtNum(val: number, decimals: number = 2): string {
  if (!isFinite(val)) return '0.00';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtSci(val: number, decimals: number = 2): string {
  if (!isFinite(val) || val === 0) return '0.00';
  const exponent = Math.floor(Math.log10(Math.abs(val)));
  const mantissa = val / Math.pow(10, exponent);
  return `${mantissa.toFixed(decimals)} × 10^{${exponent}}`;
}

export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function drawVectorArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  label?: string,
  headLen: number = 10
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);
  const length = Math.hypot(dx, dy);

  if (length < 2) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;

  // Main line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Arrow head
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLen * Math.cos(angle - Math.PI / 6),
    toY - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headLen * Math.cos(angle + Math.PI / 6),
    toY - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  // Label
  if (label) {
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.fillStyle = color;
    const midX = (fromX + toX) / 2 + Math.cos(angle + Math.PI / 2) * 12;
    const midY = (fromY + toY) / 2 + Math.sin(angle + Math.PI / 2) * 12;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, midX, midY);
  }
  ctx.restore();
}

export const LOCATION_DATA = {
  pole: { nameBn: 'উত্তর/দক্ষিণ মেরু (Pole)', nameEn: 'Poles (90°)', lat: 90, r: 6357, g: 9.832 },
  dhaka: { nameBn: 'ঢাকা, বাংলাদেশ (Dhaka)', nameEn: 'Dhaka (23.8°N)', lat: 23.81, r: 6373, g: 9.789 },
  equator: { nameBn: 'বিষুব রেখা (Equator)', nameEn: 'Equator (0°)', lat: 0, r: 6378, g: 9.780 },
  everest: { nameBn: 'মাউন্ট এভারেস্ট (Mt. Everest)', nameEn: 'Mt. Everest (+8.8 km)', lat: 27.98, r: 6382, g: 9.764 },
};
