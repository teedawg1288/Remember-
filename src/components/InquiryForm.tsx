import React, { useState } from 'react';
import { ArrowRight, Lightbulb, Compass, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { DomainSuggestion } from '../types/translation';

interface InquiryFormProps {
  onSubmit: (unfamiliarTopic: string, familiarDomain: string) => void;
  isLoading: boolean;
  onSelectSuggestion?: (unfamiliar: string, familiar: string) => void;
}

const COMMON_DOMAINS = [
  'Car mechanics & auto repair',
  'Cooking & baking in the kitchen',
  'Parenting & raising kids',
  'Dog training & household pets',
  'Gardening & soil care',
  'Construction & carpentry',
  'Team sports & game coaching',
  'Everyday plumbing & water pressure',
  'Budgeting & household finance',
  'Personal relationships & friendships',
];

const PROMPT_INSPIRATIONS = [
  'How quantum computing differs from regular chips',
  'Why inflation occurs and how interest rates affect it',
  'How machine learning models actually learn from data',
  'How fractional reserve banking and loans work',
  'Why autoimmune diseases attack the body\'s own tissue',
  'How contract clauses like indemnity and liability work',
];

export const InquiryForm: React.FC<InquiryFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [unfamiliarTopic, setUnfamiliarTopic] = useState('');
  const [familiarDomain, setFamiliarDomain] = useState('');
  const [suggestedDomains, setSuggestedDomains] = useState<DomainSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unfamiliarTopic.trim() || isLoading) return;
    onSubmit(unfamiliarTopic.trim(), familiarDomain.trim());
  };

  const handleFetchSuggestions = async () => {
    if (!unfamiliarTopic.trim() || isSuggesting) return;
    setIsSuggesting(true);
    setSuggestError(null);
    try {
      const res = await fetch('/api/suggest-domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unfamiliarTopic: unfamiliarTopic.trim() }),
      });
      const data = await res.json();
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestedDomains(data.suggestions);
      } else {
        setSuggestError('Could not generate suggestions right now.');
      }
    } catch (err: any) {
      setSuggestError('Failed to fetch domain suggestions.');
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div id="inquiry-form" className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 sm:p-8">
      <div className="mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">
          Translate an Unfamiliar Concept
        </h2>
        <p className="text-sm sm:text-base text-stone-600 mt-1">
          Bridge what confuses you with something you already have lived through.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="unfamiliarTopic"
              className="block text-sm font-semibold text-stone-900"
            >
              Step 1 — What are you trying to understand?
            </label>
            <span className="text-xs text-stone-500 font-sans">Required</span>
          </div>

          <textarea
            id="unfamiliarTopic"
            value={unfamiliarTopic}
            onChange={(e) => setUnfamiliarTopic(e.target.value)}
            placeholder="Describe any question, situation, problem, or subject (e.g., 'How DNS routing connects me to websites', 'Corporate bankruptcy priority', 'Why antibiotics don't work on viruses')..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-stone-900 text-sm sm:text-base placeholder:text-stone-400 resize-none transition-colors"
            required
          />

          {/* Prompt quick ideas */}
          <div className="pt-1">
            <div className="text-xs text-stone-500 mb-1.5 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
              <span>Or try an idea:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PROMPT_INSPIRATIONS.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUnfamiliarTopic(prompt)}
                  className="text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <label
              htmlFor="familiarDomain"
              className="block text-sm font-semibold text-stone-900"
            >
              Step 2 — What do you already understand or have experience with?
            </label>
            <span className="text-xs text-stone-400 font-sans">Optional</span>
          </div>

          <p className="text-xs text-stone-500">
            Tell us about your hobbies, jobs, or daily habits. If you leave this blank, the AI will select or suggest the best intuitive comparison.
          </p>

          <input
            id="familiarDomain"
            type="text"
            value={familiarDomain}
            onChange={(e) => setFamiliarDomain(e.target.value)}
            placeholder="e.g. Cooking, auto repair, parenting, gardening, soccer, plumbing, carpentry, pets..."
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-stone-900 text-sm sm:text-base placeholder:text-stone-400 transition-colors"
          />

          {/* Quick choices & AI domain assistant */}
          <div className="pt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-stone-500">Popular everyday experiences:</span>
              <button
                type="button"
                onClick={handleFetchSuggestions}
                disabled={!unfamiliarTopic.trim() || isSuggesting}
                className="text-xs font-medium text-amber-900 hover:text-amber-950 flex items-center gap-1 disabled:opacity-50 min-h-[36px] py-1 px-2 rounded-md hover:bg-amber-50"
              >
                {isSuggesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Finding best matches...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5" />
                    <span>Find tailored comparisons for my topic</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-1.5">
              {COMMON_DOMAINS.map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setFamiliarDomain(dom)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                    familiarDomain === dom
                      ? 'bg-stone-900 text-white border-stone-900 font-medium'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>

            {/* AI Suggested domains if generated */}
            {suggestedDomains.length > 0 && (
              <div className="mt-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                  <span>Tailored Comparisons for Your Topic:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedDomains.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFamiliarDomain(s.domain)}
                      className="text-left p-2.5 rounded-lg bg-white border border-amber-200 hover:border-amber-400 hover:shadow-xs transition-all text-xs"
                    >
                      <div className="font-semibold text-stone-900">{s.domain}</div>
                      <div className="text-stone-600 text-[11px] mt-0.5 leading-snug">{s.reason}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {suggestError && (
              <p className="text-xs text-rose-600 mt-1">{suggestError}</p>
            )}
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!unfamiliarTopic.trim() || isLoading}
            className="w-full min-h-[50px] py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white font-medium text-base transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:active:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Translating relationships & finding gaps...</span>
              </>
            ) : (
              <>
                <span>Step 3 & 4 — Translate & Discover Gaps</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
