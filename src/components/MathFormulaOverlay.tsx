import React from 'react';
import { MathView } from './MathView';
import { P38Mode } from '../types';
import { BookOpen, X, CheckCircle2 } from 'lucide-react';

interface MathFormulaOverlayProps {
  mode: P38Mode;
  show: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
}

export const MathFormulaOverlay: React.FC<MathFormulaOverlayProps> = ({
  mode,
  show,
  onClose,
  lang,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white">
            {lang === 'bn' ? 'P-38 গাণিতিক সমীকরণ ও বিশ্লেষণ' : 'P-38 Mathematical Derivations & Proofs'}
          </h2>
        </div>

        <div className="space-y-6 text-sm">
          {/* Base Formula */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-emerald-400 font-bold text-base">
              {lang === 'bn' ? '১. মহাকর্ষীয় ধ্রুবক (G) ও অভিকর্ষজ ত্বরণ (g)-এর সম্পর্ক' : '1. Relation Between G and g'}
            </h3>
            <p className="text-slate-300">
              {lang === 'bn'
                ? 'পৃথিবীপৃষ্ঠে m ভরের কোনো বস্তুর উপর প্রযুক্ত মহাকর্ষ বলই এর ওজন:'
                : 'Gravitational attraction at Earth surface equals the weight of mass m:'}
            </p>
            <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-emerald-300">
              <MathView math="F = G \frac{M m}{R^2} = mg \implies g = \frac{GM}{R^2}" block />
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'bn'
                ? 'যেখানে M = ৫.৯৭২ × ১০²⁴ kg (পৃথিবীর ভর) এবং R = ৬,৩৭১ km (গড় ব্যাসার্ধ)।'
                : 'where M = 5.972 × 10²⁴ kg and mean radius R = 6,371 km.'}
            </p>
          </div>

          {/* Altitude (h) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-cyan-400 font-bold text-base">
              {lang === 'bn' ? '২. উচ্চতার (h) জন্য g-এর পরিবর্তন' : '2. Variation of g with Altitude (h)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'যেকোনো উচ্চতায় সঠিক সূত্র (Exact)' : 'Exact Formula for Any Altitude'}</div>
                <MathView math="g_h = g \left(\frac{R}{R + h}\right)^2" block />
              </div>
              <div className="p-3 bg-slate-900 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'কম উচ্চতায় আসন্নমান (h ≪ R)' : 'Binomial Approx (h ≪ R)'}</div>
                <MathView math="g_h \approx g \left(1 - \frac{2h}{R}\right)" block />
              </div>
            </div>
          </div>

          {/* Depth (d) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-amber-400 font-bold text-base">
              {lang === 'bn' ? '৩. ভূ-অভ্যন্তরে গভীরতার (d) জন্য g-এর পরিবর্তন' : '3. Variation of g with Depth (d)'}
            </h3>
            <p className="text-slate-300">
              {lang === 'bn'
                ? 'd গভীরতায় কেবল (R - d) ব্যাসার্ধের ভেতরের গোলকটিই কার্যকর আকর্ষণ বল প্রদান করে:'
                : 'At depth d, only the concentric sphere of radius (R - d) contributes to net attraction:'}
            </p>
            <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-amber-300">
              <MathView math="g_d = g \left(1 - \frac{d}{R}\right) \quad \text{এবং কেন্দ্রে } (d=R): g_c = 0" block />
            </div>
            <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs text-amber-300">
              {lang === 'bn'
                ? '💡 গুরুত্বপূর্ণ সম্পর্ক: কম উচ্চতার ক্ষেত্রে, g_h = g_d হলে d = 2h হবে।'
                : '💡 Key relation for small values: If g_h = g_d, then d = 2h.'}
            </div>
          </div>

          {/* Diurnal Rotation */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-rose-400 font-bold text-base">
              {lang === 'bn' ? '৪. পৃথিবীর আহ্নিক গতি ও ১৭ গুণ ঘূর্ণন ওজনহীনতা' : "4. Diurnal Rotation & 17x Weightlessness"}
            </h3>
            <p className="text-slate-300">
              {lang === 'bn'
                ? 'λ অক্ষাংশে কেন্দ্রবিমুখী বলের কারণে কার্যকর অভিকর্ষজ ত্বরণ হ্রাস পায়:'
                : 'Centrifugal acceleration reduces effective gravity at latitude λ:'}
            </p>
            <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-rose-300">
              <MathView math="g_\lambda = g - \omega^2 R \cos^2\lambda" block />
            </div>
            <p className="text-slate-400 text-xs">
              {lang === 'bn'
                ? 'বিষুবরেখায় (λ = 0°): g_e = g - ω²R। ওজনহীনতার জন্য g_e = 0 ⟹ ω = √(g/R) ≈ 17 ω₀। তখন দিনের দৈর্ঘ্য হবে T = 1.41 ঘণ্টা (৮৪.৬ মিনিট)!'
                : 'At the equator (λ = 0°): g_e = g - ω²R. For zero apparent gravity: ω = √(g/R) ≈ 17 ω₀, resulting in a day length of just 84.6 minutes!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
