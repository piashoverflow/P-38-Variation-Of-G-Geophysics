import { Language } from '../types';

export const translations = {
  bn: {
    // Header
    brandTitle: 'অভিকর্ষজ ত্বরণ g ও ভূ-পদার্থবিজ্ঞান',
    brandSubtitle: 'ল্যাব',
    tabAltitude: 'উচ্চতার প্রভাব (Altitude h)',
    tabDepth: 'গভীরতার প্রভাব (Depth d)',
    tabShape: 'পৃথিবীর আকার (Oblate Shape)',
    tabRotation: 'আহ্নিক গতি (Diurnal Rotation)',
    tabCavendish: 'G ও g এর সম্পর্ক (Cavendish)',
    theoryButton: 'থিওরি ও সূত্রাবলী',
    udvashBadge: 'উদ্ভাস (Udvash)',

    // Controls
    controlParameters: 'কন্ট্রোল প্যারামিটারস',
    resetDefaults: 'ডিফল্ট রিসেট',
    altitudeH: 'উচ্চতা (Altitude h)',
    depthD: 'গভীরতা (Depth d)',
    earthCenterDist: 'কেন্দ্র হতে দূরত্ব (r = R - d)',
    latitudeDeg: 'অক্ষাংশ (Latitude λ)',
    rotationSpeed: 'ঘূর্ণন দ্রুতি গুণক (ω / ω₀)',
    earthLocations: 'ভৌগোলিক অবস্থান নির্বাচন:',
    weightlessnessAlert: '⚠️ ১৭ গুণ দ্রুত ঘূর্ণনে বিষুব রেখায় আপাত ওজন শূন্য হয়!',

    // Toggles
    visualizerToggles: 'ভিজ্যুয়ালাইজার অপশনস',
    showVectors: 'অভিকর্ষ ও অপকেন্দ্র বল ভেক্টর',
    showEarthCutaway: 'ভূ-অভ্যন্তর স্তরচ্ছেদ (Core & Mantle)',
    showBulge: 'মেরু চ্যাপ্টা ও বিষুব স্ফীতি',
    showGrid: 'স্থানাঙ্ক গ্রিড (Grid)',

    // Telemetry & Stats
    telemetryTitle: 'লাইভ পরিমাপ ও টেলিমেট্রি',
    currentG: 'কার্যকর অভিকর্ষজ ত্বরণ (g)',
    surfaceG: 'ভূপৃষ্ঠের প্রমাণ মান (g_s)',
    percentChange: 'g এর হ্রাস/পরিবর্তন (%Δg)',
    apparentWeight: 'আপাত ওজন (W_app = mg)',
    centrifugalAcc: 'অপকেন্দ্র ত্বরণ (a_c = ω²R cosλ)',
    dayLength: 'এক দিনের দৈর্ঘ্য (Day Length)',
    
    // Math Box
    exactMathTitle: 'গাণিতিক সমীকরণ ও প্রতিস্থাপন',
    play: 'শুরু করুন',
    pause: 'থামুন',
    step: 'ধাপ (Step)',
    slowMo: '০.২৫x স্লো-মো',
    reset: 'রিসেট',
    fullScreen: 'পূর্ণ পর্দা',
    exitFullScreen: 'ছোট পর্দা',
  },
  en: {
    // Header
    brandTitle: 'Variation of g & Geophysics',
    brandSubtitle: 'LAB',
    tabAltitude: 'Altitude Effect (h)',
    tabDepth: 'Depth Effect (d)',
    tabShape: "Earth's Oblate Shape",
    tabRotation: 'Diurnal Earth Rotation',
    tabCavendish: 'Relation of G & g',
    theoryButton: 'Theory & Proofs',
    udvashBadge: 'Udvash',

    // Controls
    controlParameters: 'Control Parameters',
    resetDefaults: 'Reset Defaults',
    altitudeH: 'Altitude (h)',
    depthD: 'Depth (d)',
    earthCenterDist: 'Distance from Center (r = R - d)',
    latitudeDeg: 'Latitude (λ)',
    rotationSpeed: 'Angular Velocity (ω / ω₀)',
    earthLocations: 'Geographical Locations:',
    weightlessnessAlert: '⚠️ At 17x rotation, apparent weight at equator becomes zero!',

    // Toggles
    visualizerToggles: 'Visualizer Options',
    showVectors: 'Gravity & Centrifugal Vectors',
    showEarthCutaway: 'Earth Internal Cutaway',
    showBulge: 'Equatorial Bulge & Polar Flattening',
    showGrid: 'Coordinate Grid',

    // Telemetry & Stats
    telemetryTitle: 'Live Geophysics Telemetry',
    currentG: 'Effective Gravity (g)',
    surfaceG: 'Standard Surface Gravity (g_s)',
    percentChange: 'Percentage Change (%Δg)',
    apparentWeight: 'Apparent Weight (W_app)',
    centrifugalAcc: 'Centrifugal Accel (a_c)',
    dayLength: 'Day Length (Hours)',
    
    // Math Box
    exactMathTitle: 'Mathematical Equations & Substitution',
    play: 'Play',
    pause: 'Pause',
    step: 'Step',
    slowMo: '0.25x Slow-Mo',
    reset: 'Reset',
    fullScreen: 'Fullscreen',
    exitFullScreen: 'Exit Fullscreen',
  },
};

export function t(lang: Language, key: keyof typeof translations['bn']): string {
  return translations[lang][key] || translations['bn'][key] || key;
}
