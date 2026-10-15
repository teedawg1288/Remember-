import React from 'react';
import { TranslationResult } from '../types/translation';
import { EXAMPLE_TOPICS } from '../data/examples';
import { ArrowRight, Wrench, Heart, Droplets } from 'lucide-react';

interface ExamplesGridProps {
  onSelectExample: (example: TranslationResult) => void;
}

export const ExamplesGrid: React.FC<ExamplesGridProps> = ({ onSelectExample }) => {
  const getIcon = (id: string) => {
    if (id.includes('court')) return <Wrench className="w-5 h-5 text-amber-800" />;
    if (id.includes('dog')) return <Heart className="w-5 h-5 text-amber-800" />;
    return <Droplets className="w-5 h-5 text-amber-800" />;
  };

  return (
    <div id="examples-section" className="py-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-1">
            Proven Analogies
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
            Explore 3 Working Example Topics
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Tap any of these real-world comparisons to see how bidirectional mapping, 
            difference boundaries, and the &ldquo;What am I missing?&rdquo; investigation work.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {EXAMPLE_TOPICS.map((topic, index) => (
          <div
            key={topic.id}
            onClick={() => onSelectExample(topic)}
            className="group cursor-pointer bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              {/* Header unboxed editorial metadata */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                <span className="font-mono text-stone-400">0{index + 1}</span>
                <span className="text-amber-800 font-medium">Interactive Demo</span>
              </div>

              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {getIcon(topic.id)}
              </div>

              <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-amber-950 transition-colors leading-snug">
                {index === 0 && 'Court Procedures via Car Mechanics'}
                {index === 1 && 'Teamwork via an Older Dog & Puppy'}
                {index === 2 && 'Battery Life via Water Systems'}
              </h3>

              <div className="mt-3 text-xs text-stone-600 space-y-1.5">
                <div>
                  <span className="text-stone-400">Unfamiliar: </span>
                  <span className="font-medium text-stone-800">{topic.unfamiliarTopic}</span>
                </div>
                <div>
                  <span className="text-stone-400">Through: </span>
                  <span className="font-medium text-stone-800">{topic.familiarDomain}</span>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed border-t border-stone-100 pt-3">
                &ldquo;{topic.headlineSummary}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900 group-hover:text-amber-900">
              <span>Explore Translation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
