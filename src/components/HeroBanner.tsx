import React, { useState } from 'react';
import { Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface HeroBannerProps {
  onScrollToForm: () => void;
  onScrollToExamples: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onScrollToForm,
  onScrollToExamples,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative overflow-hidden pt-6 pb-10 md:pt-10 md:pb-14 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Typography & Intent */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Editorial Kicker (clean unboxed text, no static pills) */}
            <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-3">
              Cognitive Translation & Analogical Bridging
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-900 font-semibold tracking-tight leading-[1.15] text-balance mb-4">
              Understand what you don&apos;t know through what you already do.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mb-6">
              When an unfamiliar concept feels confusing, the solution isn&apos;t more technical jargon. 
              It&apos;s recognizing that the same underlying relationships—pressure, growth, feedback, 
              and boundaries—already exist in things you live with every single day.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onScrollToForm}
                className="min-h-[48px] px-6 py-2.5 rounded-xl bg-stone-900 text-stone-50 font-medium text-sm sm:text-base hover:bg-stone-800 transition-all flex items-center gap-2 shadow-sm active:scale-[0.98]"
              >
                <span>Translate a Subject</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToExamples}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-sm sm:text-base transition-colors flex items-center gap-2 active:scale-[0.98]"
              >
                <span>See 3 Core Examples</span>
              </button>
            </div>

            {/* Framework Anchor Footnote */}
            <div className="mt-8 pt-6 border-t border-stone-200/80 flex items-center gap-2 text-xs text-stone-500">
              <span className="font-medium text-stone-700">The 5-stage framework:</span>
              <span>Reality</span>
              <span aria-hidden="true">→</span>
              <span>Observation</span>
              <span aria-hidden="true">→</span>
              <span>Translation</span>
              <span aria-hidden="true">→</span>
              <span>Understanding</span>
              <span aria-hidden="true">→</span>
              <span>Action</span>
            </div>
          </div>

          {/* Right Column: Visual Art & Bridge Metaphor */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200/80 shadow-md bg-stone-100 aspect-16/9 lg:aspect-4/3 group">
              {!imageError ? (
                <img
                  src="/src/assets/images/hero_bridge_analogies_1791653424025.jpg"
                  alt="Knowledge translation illustration showing everyday artisan tools connecting across a bridge to abstract concepts"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
              ) : (
                /* Styled fallback container */
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-50 to-stone-200 text-stone-700 text-center">
                  <Layers className="w-12 h-12 text-amber-800/80 mb-3" />
                  <p className="font-serif text-lg font-medium text-stone-900">
                    Bridging Familiar & Unfamiliar Worlds
                  </p>
                  <p className="text-xs text-stone-600 mt-1 max-w-xs">
                    Connecting daily craft, hands-on experience, and complex ideas.
                  </p>
                </div>
              )}

              {/* Quiet caption scrim */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent text-stone-100 text-xs flex justify-between items-center">
                <span className="font-medium">Everyday Experience · Unknown Systems</span>
                <span className="text-stone-300">The Last 10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
