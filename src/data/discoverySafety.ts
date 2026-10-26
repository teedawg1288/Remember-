import type { CoreDiscovery } from '../types/discovery';

/**
 * A small, deterministic boundary for urgent or hazardous questions. Pattern
 * matching is intentionally narrow: this is not a medical triage engine.
 * It only prevents the analogy engine from providing false reassurance or
 * presenting transferred experience as authority to attempt hazardous work.
 */
export type DiscoveryRisk = {
  level: 'emergency' | 'boundary';
  notice: string;
  immediateAction?: string;
};

export function assessDiscoveryRisk(question: string): DiscoveryRisk | null {
  const q = question.toLowerCase();
  const chestPain = /\b(?:chest pain|chest pressure|chest tightness)\b/.test(q);
  if (chestPain && /\b(?:my|someone|person|they|he|she|having|feel|feeling|just|indigestion|ignore|decide|tell if|figure out|serious)\b/.test(q)) {
    return {
      level: 'emergency',
      notice: 'Chest pain cannot safely be diagnosed through an analogy or dismissed as indigestion.',
      immediateAction: 'If chest pain is happening now, call 911 for emergency medical help. Do not wait to test the comparison.',
    };
  }
  if (/\b(?:dog|puppy|pet)\b/.test(q) && /(?:can(?:not|'t)|isn['’]?t|not|stopped|won['’]?t)\s+breath(?:e|ing)|no\s+breathing|unconscious/.test(q)) {
    return {
      level: 'emergency',
      notice: 'Human first-aid experience does not mean the same techniques are safe or effective for a dog.',
      immediateAction: 'Contact an emergency veterinarian immediately. If the animal is unresponsive and not breathing, use veterinary first-aid/CPR guidance while getting emergency help.',
    };
  }
  if (/\b(?:perform|do|attempt|carry out)\b.*\b(?:surgery|operation)\b/.test(q) && /\b(?:can i|could i|i know|i can|safely|same steps|by comparing|mean i)\b/.test(q)) {
    return {
      level: 'boundary',
      notice: 'No. Familiar skills can explain parts of a surgical workflow; they do not qualify someone to perform surgery. Surgery requires professional training, facilities and clinical oversight.',
    };
  }
  if (/\b(?:household|home|mains|electrical)\s+(?:wiring|electricity)\b/.test(q) && /\b(?:repair|rewire|fix|wire|same steps|could i|can i)\b/.test(q)) {
    return {
      level: 'boundary',
      notice: 'A repair sequence may be familiar, but it does not establish electrical competence. Household wiring can cause shock or fire; use a qualified electrician for work beyond your competence.',
    };
  }
  if (/\b(?:insulin|medication|drug)\s+(?:dose|dosing|dosage)\b/.test(q) && /\b(?:calculate|decide|guess|test|same steps|use|adjust)\b/.test(q)) {
    return {
      level: 'boundary',
      notice: 'An analogy cannot determine a safe medication dose. Use your prescribed plan or ask a qualified healthcare professional.',
    };
  }
  return null;
}

export function urgentDiscovery(question: string, risk: DiscoveryRisk): CoreDiscovery {
  if (risk.level !== 'emergency' || !risk.immediateAction) throw new Error('NOT_EMERGENCY');
  return {
    version: 2,
    question,
    whatIsReported: 'The question asks whether experience in another field can settle a potentially urgent health situation. It does not establish the cause.',
    reportedChain: null,
    possibleMechanism: 'Different emergencies can share symptoms, and resemblance to a familiar problem cannot rule out a dangerous cause.',
    alternativeExplanations: [],
    bridges: [],
    missingInformation: 'An urgent professional assessment is needed; a cross-system comparison cannot provide one.',
    nextCheck: risk.immediateAction,
    meaningCheck: null,
    prediction: null,
    safetyNotice: risk.notice + ' ' + risk.immediateAction,
    screening: { status: 'rejected', reason: 'Safety takes priority over the analogy.', causalMatch: '', crucialDifference: '' },
  };
}
