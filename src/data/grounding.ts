/** Conservative guards for experience claims and user-facing discoveries.
 * They do not verify science; they prevent unsupported claims about the PERSON
 * and control whether an outside experience can be called familiar.
 */
const normalized = (text: string): string =>
  text.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();

export function quoteAppearsInQuestion(question: string, excerpt: string): boolean {
  const quote = normalized(excerpt);
  return quote.length >= 10 && normalized(question).includes(quote);
}

export function confirmedExperienceExcerpt(question: string, donor: string): string | null {
  // Do not claim an experience is confirmed just because the user and the
  // example share a generic action verb (washed a car != washed windows).
  const excluded = new Set([
    'system', 'machine', 'management', 'process', 'cleaner', 'airflow', 'repair',
    'restoration', 'experience', 'wash', 'clean', 'fix', 'check', 'test', 'plan',
    'organize', 'work', 'build', 'maintain', 'learn', 'do', 'make', 'run',
    'activity', 'task', 'method', 'approach', 'methodology',
  ]);
  const base = (word: string): string => {
    if (/ies$/i.test(word) && word.length > 4) return word.slice(0, -3) + 'y';
    if (/s$/i.test(word) && !/ss$/i.test(word)) return word.slice(0, -1);
    return word.replace(/(?:ations|ation|ments|ment|ities|ity|ing|ed)$/i, '');
  };
  const terms = normalized(donor).split(' ').map(base).filter(word => word.length >= 4 && !excluded.has(word));
  if (!terms.length) return null;
  const sentences = question.split(/(?<=[.!?])\s+/);
  for (const sentence of sentences) {
    const lower = normalized(sentence);
    if (!terms.some(term => lower.split(' ').some(word => base(word) === term))) continue;
    if (!/\b(?:i|we)\s+(?:(?:have|had)\s+|know\s+how\s+to\s+|can\s+)?(?:know|understand|fix(?:ed)?|repair(?:ed)?|restor(?:e|ed)|refinish(?:ed)?|detail(?:ed)?|plan(?:ned)?|organize(?:d)?|learn(?:ed|t)?|manage(?:d)?|used?|build|built|worked?|did|do|make|made|run|ran|sweep|swept|grease(?:d)?|paint(?:ed)?|check(?:ed)?|wash(?:ed)?|test(?:ed)?|maintain(?:ed)?|cook(?:ed)?|drive|drove)\b/i.test(lower)) continue;
    if (/\b(?:never|not|no|don t|didn t|haven t|have not|do not|cannot|can t)\b/i.test(lower)) continue;
    return sentence.trim().slice(0, 350);
  }
  return null;
}

/** Past-tense actions about the user must be present in their own report.
 * Conditional examples ("if you sanded ...") are not claims of past action.
 */
export function unsupportedCompletedActionAttribution(question: string, output: string): boolean {
  const claimed = /\b(?:you|the user|the person)\s+(?:(?:have|had|already)\s+)?(cleared|sanded|scraped|removed|cleaned|lubricated|greased|filled|painted|drilled|polished|replaced|tightened|welded|measured|tested|diagnosed)\b/gi;
  const q = normalized(question);
  for (const match of output.matchAll(claimed)) {
    const prior = output.slice(Math.max(0, (match.index || 0) - 18), match.index || 0);
    if (/\b(?:if|when|might|would|could|should|whether)\s*$/i.test(prior)) continue;
    const verb = match[1].toLowerCase().replace(/(?:ed|d)$/,'');
    if (!q.split(' ').some(token => token.startsWith(verb))) return true;
  }
  return false;
}

/** Flags unsupported attributions of the user's motives/actions.
 * Neutral claims such as "the user reports" are intentionally not flagged.
 */
export function unsupportedPersonalAttribution(question: string, output: string): boolean {
  const matcher = /\b(?:the user|this user|the person|you)\s+(?:(?:will|would|has|had|is|are|keep|keeps)\s+)?(treat\w*|ignor\w*|refus\w*|assum\w*|believ\w*|intend\w*|choos\w*|decid\w*|deliberately|fail\w*\s+to)\b/gi;
  for (const match of output.matchAll(matcher)) {
    const stem = match[1].toLocaleLowerCase().replace(/(s|ed|ing)$/i, '').slice(0, 5);
    if (!/\b(i|we)\b/i.test(question) || !normalized(question).split(' ').some(token => token.startsWith(stem))) {
      return true;
    }
  }
  return false;
}

export function isLeadingPredictionQuestion(question: string): boolean {
  return /\b(?:don't you (?:think|agree|admit)|isn't it (?:obvious|clear|true)|why (?:do|did) you (?:keep|refuse|ignore|always)|you (?:clearly|obviously|must) (?:know|admit|realize))\b/i.test(question);
}

export function hasUnexplainedAcronym(text: string): boolean {
  return [...text.matchAll(/\b[A-Z]{2,}\b/g)].some(match => {
    if (['AI', 'REMEMBER'].includes(match[0])) return false;
    return !/^\s*\([^)]+\)/.test(text.slice((match.index || 0) + match[0].length));
  });
}
