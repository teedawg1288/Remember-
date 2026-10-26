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
  const excluded = new Set(['system', 'machine', 'management', 'process', 'cleaner', 'airflow', 'repair', 'restoration', 'experience']);
  const terms = normalized(donor).split(' ').filter(word => word.length >= 4 && !excluded.has(word));
  if (!terms.length) return null;
  const sentences = question.split(/(?<=[.!?])\s+/);
  for (const sentence of sentences) {
    const lower = normalized(sentence);
    if (!terms.some(term => lower.includes(term))) continue;
    if (!/\b(?:i|we)\s+(?:have\s+|had\s+)?(?:know|understand|fixed|repaired|restored|used|built|worked|did|can\s+(?:fix|repair|restore|build|use))\b/i.test(lower)) continue;
    if (/\b(?:never|not|no|don t|didn t|haven t|have not|do not|cannot|can t)\b/i.test(lower)) continue;
    return sentence.trim().slice(0, 350);
  }
  return null;
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
