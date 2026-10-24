import type { RoundTablePerspective } from '../types/sameStory';

export type LensWeights = Record<string, number>;

// Weights allocate the table's attention; they are not confidence or proof.
export function normalizeLensWeights(input: LensWeights): LensWeights {
  const ids = Object.keys(input);
  if (!ids.length) return {};
  const raw = ids.map(id => Math.max(0, Number.isFinite(input[id]) ? input[id] : 0));
  const sum = raw.reduce((a, b) => a + b, 0);
  const proportions = sum > 0 ? raw.map(value => value * 100 / sum) : ids.map(() => 100 / ids.length);
  const floors = proportions.map(Math.floor);
  let spare = 100 - floors.reduce((a, b) => a + b, 0);
  const order = ids.map((_, i) => i).sort((a, b) => (proportions[b] - floors[b]) - (proportions[a] - floors[a]));
  for (let i = 0; i < spare; i++) floors[order[i]]++;
  return Object.fromEntries(ids.map((id, i) => [id, floors[i]]));
}

export function redistributeLensWeight(weights: LensWeights, changedId: string, value: number): LensWeights {
  if (!(changedId in weights)) return normalizeLensWeights(weights);
  const target = Math.max(0, Math.min(100, Math.round(Number.isFinite(value) ? value : 0)));
  const rest = Object.keys(weights).filter(id => id !== changedId);
  if (!rest.length) return { [changedId]: 100 };
  const normalizedRest = normalizeLensWeights(Object.fromEntries(rest.map(id => [id, weights[id]])));
  const raw: LensWeights = { [changedId]: target };
  for (const id of rest) raw[id] = normalizedRest[id] * (100 - target) / 100;
  // Preserve the selected value exactly; distribute rounding only among the other seats.
  const remaining = 100 - target;
  const restWeights = normalizeLensWeights(Object.fromEntries(rest.map(id => [id, raw[id]])));
  const scaled = rest.map(id => ({ id, unrounded: restWeights[id] * remaining / 100 }));
  const floors = scaled.map(item => Math.floor(item.unrounded));
  const remainder = remaining - floors.reduce((a, b) => a + b, 0);
  const order = scaled.map((_, i) => i).sort((a, b) => (scaled[b].unrounded - floors[b]) - (scaled[a].unrounded - floors[a]));
  for (let i = 0; i < remainder; i++) floors[order[i]]++;
  for (let i = 0; i < rest.length; i++) raw[rest[i]] = floors[i];
  return raw;
}

export function chooseAutomaticLensWeights(question: string, perspectives: RoundTablePerspective[]): LensWeights {
  const q = question.toLowerCase();
  const scores: LensWeights = {};
  for (const seat of perspectives.slice(0, 6)) {
    const role = (seat.id + ' ' + seat.name + ' ' + seat.role).toLowerCase();
    let score = 1;
    if (/relationship|friend|family|feeling|argument|person|conversation|trust|workplace/.test(q) &&
        /barber|person|human|social|psycholog|lived|counsel/.test(role)) score += 2;
    if (/process|system|code|engineering|network|machine|business|organisation|organization|money|work/.test(q) &&
        /engineer|system|econom|logic|technolog/.test(role)) score += 2;
    if (/health|cancer|cell|body|immune|medical|biology|organism|disease/.test(q) &&
        /biolog|medic|science|health|clin/.test(role)) score += 2;
    if (/history|ancient|religion|myth|culture|war|generation|repeat|tradition/.test(q) &&
        /histor|cultur|myth|anthropol/.test(role)) score += 2;
    scores[seat.id] = score;
  }
  return normalizeLensWeights(scores);
}
