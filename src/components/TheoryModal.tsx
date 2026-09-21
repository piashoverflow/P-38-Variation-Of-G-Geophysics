import React from 'react';
import { Language } from '../types';
import { t } from '../utils/i18n';
import { X, BookOpen, GraduationCap } from 'lucide-react';

interface TheoryModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 text-slate-900">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {language === 'bn' ? 'তত্ত্ব ও সমীকরণ বিশ্লেষণ (P-38)' : 'Theory & Derivations (P-38)'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                HSC Physics 1st Paper, Chapter 6: g এর মান ও চার কারণে এর পরিবর্তন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: G vs g */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              ১. মহাকর্ষীয় ধ্রুবক G ও অভিকর্ষজ ত্বরণ g এর সম্পর্ক
            </h3>
            <p>
              নিউটনের সূত্রানুসারে m ভরের কোনো বস্তুর উপর পৃথিবীর আকর্ষণ বল F = G·M·m / R² এবং গতির ২য় সূত্রানুসারে F = mg। এই দুটি তুলনা করলে পাওয়া যায়:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-xs font-bold text-slate-900">
              g = GM / R² = ⁴⁄₃ π G ρ R
            </div>
          </div>

          {/* Section 2: Altitude Effect */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              ২. উচ্চতার ক্রিয়া (Variation with Altitude h)
            </h3>
            <p>ভূপৃষ্ঠ হতে h উচ্চতায় অভিকর্ষজ ত্বরণ g_h:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-50 rounded-xl border">
                <strong className="text-slate-900 block font-sans">সঠিক সূত্র (যেকোনো উচ্চতায়):</strong>
                <p className="text-sky-800 font-bold mt-1">g_h = g · [R / (R + h)]²</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border">
                <strong className="text-slate-900 block font-sans">আসন্ন সূত্র (h ≪ R হলে):</strong>
                <p className="text-amber-800 font-bold mt-1">g_h ≈ g · (1 - 2h/R)</p>
              </div>
            </div>
          </div>

          {/* Section 3: Depth Effect */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              ৩. গভীরতার ক্রিয়া (Variation with Depth d)
            </h3>
            <p>
              ভূপৃষ্ঠ হতে d গভীরতায় কেবলমাত্র (R - d) ব্যাসার্ধের অভ্যন্তরীণ গোলকটি আকর্ষণ করে (Shell Theorem)।
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-xs font-bold text-slate-900">
              g_d = g · (1 - d/R) = g · (r / R)
            </div>
            <p className="text-xs text-slate-600">
              ভূ-কেন্দ্রে d = R, সুতরাং g_center = 0। অর্থাৎ পৃথিবীর কেন্দ্রে কোনো বস্তুর ওজন শূন্য!
            </p>
          </div>

          {/* Section 4: Diurnal Rotation */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              ৪. পৃথিবীর আহ্নিক গতির প্রভাব (Diurnal Rotation)
            </h3>
            <p>
              পৃথিবীর নিজ অক্ষের সাপেক্ষে আবর্তনের ফলে সৃষ্ট অপকেন্দ্র বলের প্রভাবে λ অক্ষাংশে কার্যকর অভিকর্ষজ ত্বরণ:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-xs font-bold text-slate-900">
              g_λ = g - ω² R cos²λ
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <strong>মেরুতে (λ = 90°):</strong> cos90° = 0 ➔ g_pole = g (আহ্নিক গতির কোনো প্রভাব নেই)।
              </div>
              <div className="p-2 bg-rose-50 rounded-lg border border-rose-200">
                <strong>বিষুব রেখায় (λ = 0°):</strong> cos0° = 1 ➔ g_eq = g - ω²R (হ্রাস সর্বাধিক)।
              </div>
            </div>
          </div>

          {/* Section 5: Udvash Admission Tips */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>উদ্ভাস ভর্তি পরীক্ষা স্পেশাল কনসেপ্ট (BUET / Medical / DU)</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li><strong>উচ্চতা ও গভীরতার সম্পর্ক:</strong> স্বল্প উচ্চতায় একই পরিমাণ g হ্রাস পেতে হলে h উচ্চতা 2d গভীরতার সমতুল্য: <strong>Δg_h = 2 Δg_d ➔ h = d / 2</strong>।</li>
              <li><strong>১৭ গুণ আহ্নিক গতি:</strong> বিষুব রেখায় ওজন শূন্য হতে হলে ω' = √(g/R) ≈ 1.24 × 10⁻³ rad/s, যা স্বাভাবিকের চেয়ে <strong>17 গুণ</strong> দ্রুত! তখন দিনের দৈর্ঘ্য হবে মাত্র <strong>১.৪ ঘণ্টা (৮৪ মিনিট)</strong>।</li>
              <li><strong>পৃথিবীর আকার:</strong> মেরু ব্যাসার্ধ R_p বিষুব ব্যাসার্ধ R_e অপেক্ষা প্রায় ২১ কিমি কম, ফলে মেরুতে g এর মান সর্বাধিক (৯.৮৩২ m/s²)।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
