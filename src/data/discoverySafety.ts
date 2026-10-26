import type { CoreDiscovery } from '../types/discovery';

/**
 * A small, deterministic boundary for urgent or hazardous questions. Pattern
 * matching is intentionally narrow: this is not a medical triage engine.
 * It only prevents the analogy engine from providing false reassurance or
 * presenting transferred experience as authority to attempt hazardous work.
 */
export type DiscoveryRisk = {
  level: 'emergency' | 'boundary' | 'stop';
  notice: string;
  immediateAction?: string;
};

export function assessDiscoveryRisk(question: string): DiscoveryRisk | null {
  const q = question.toLowerCase();
  const chestPain = /\b(?:chest pain|chest pressure|chest tightness)\b/.test(q);
  if (chestPain && /\b(?:i|my|someone|person|they|he|she|have|having|feel|feeling|sweat|sweating|just|indigestion|ignore|decide|tell if|figure out|serious)\b/.test(q)) {
    return {
      level: 'emergency',
      notice: 'Chest pain cannot safely be diagnosed through an analogy or dismissed as indigestion.',
      immediateAction: 'If chest pain is happening now, call 911 for emergency medical help. Do not wait to test the comparison.',
    };
  }
  // Safety comes before analogy. These rules deliberately look for the
  // situation, not a small list of expected phrasings or a particular job.
  // They are a conservative stop sign, not a diagnosis or full triage engine.
  const swallowedMedicine = /\b(?:child|kid|daughter|son|baby|toddler|infant|i|someone|person)\b.{0,100}\b(?:swallow(?:ed)?|ate|ingest(?:ed)?|took)\b.{0,80}\b(?:pills?|tablets?|medicines?|medications?|drugs?|unknown substances?)\b/.test(q);
  const swallowedChemical = /\b(?:drank|drunk|swallow(?:ed)?|ingest(?:ed)?|tasted)\b.{0,100}\b(?:cleaner|bleach|chemical|detergent|disinfectant|antifreeze|solvent|drain fluid)\b/.test(q);
  if (swallowedMedicine || swallowedChemical) {
    return {
      level: 'emergency',
      notice: 'A suspected poisoning cannot be assessed by comparing it with cooking, plumbing, or another familiar task.',
      immediateAction: 'Contact a poison control centre right away, even if symptoms have not started. Call emergency services if the person is seriously unwell. Do not induce vomiting or try to neutralize the substance unless poison control or a clinician directs you.',
    };
  }
  const suspectedGasRelease = /\b(?:smell(?:s|ed|ing)?|smelt|odou?r|scent)\b.{0,65}\b(?:natural\s+gas|propane|gas)\b|\b(?:natural\s+gas|propane|gas)\b.{0,65}\b(?:leak(?:s|ed|ing)?|smell(?:s|ed|ing)?|odou?r|scent|escaping|hissing)\b|\bleak(?:s|ed|ing)?\b.{0,50}\b(?:natural\s+gas|propane|gas)\b|\brotten\s+eggs?\s+smell\b/.test(q);
  if (suspectedGasRelease) {
    return {
      level: 'emergency',
      notice: 'A possible gas leak is an immediate safety issue, not a repair-by-analogy problem.',
      immediateAction: 'Leave the building immediately. Do not operate switches, appliances, or phones inside, and do not attempt a repair. From a safe location, call the gas utility emergency line or emergency services.',
    };
  }
  if (/\b(?:kill myself|end my life|take my own life|suicid(?:e|al)|hurt myself|harm myself)\b/.test(q)) {
    return {
      level: 'emergency',
      notice: 'Thoughts of suicide need direct, human support before any metaphor or life comparison.',
      immediateAction: 'If you might act on these thoughts soon, call emergency services or go to an emergency department now, and reach out to a trusted person to stay with you. In Canada or the U.S., call or text 988 for immediate crisis support.',
    };
  }
  if (/\b(?:brakes?|braking)\b.{0,60}\b(?:stopped working|not working|aren.t working|won.t work|failed?|gone out|quit working)\b/.test(q) && /\b(?:car|vehicle|driving|road|hill|pedal|truck)\b/.test(q)) {
    return {
      level: 'emergency',
      notice: 'A vehicle with failed brakes is a serious immediate hazard. Bicycle knowledge cannot make it safe to continue driving.',
      immediateAction: 'If the vehicle is moving, focus on getting it stopped safely and call emergency services if you cannot stop safely. Do not drive it again until a qualified mechanic has inspected and repaired it.',
    };
  }
  if (/\b(?:smoke|smoking|sparks?|sparking|fire|burning\s+smell)\b/.test(q) && /\b(?:breaker|electrical\s+panel|fuse\s+box|wiring\s+panel|outlet)\b/.test(q)) {
    return {
      level: 'emergency',
      notice: 'Smoke or sparks from electrical equipment are not safe to investigate through a DIY analogy.',
      immediateAction: 'Keep away from the equipment and do not open or operate the panel. Leave the area if there is smoke or fire; call emergency/fire services from a safe place and use a qualified electrician.',
    };
  }
  if (/\b(?:electrical\s+panel|breaker\s+panel|service\s+panel|fuse\s+box)\b/.test(q) &&
      /\b(?:repair|rewire|fix|open|replace|work on|touch)\b/.test(q)) {
    return {
      level: 'stop',
      notice: 'Knowing how to wire a lamp does not make it safe to work inside an electrical service panel.',
      immediateAction: 'Do not open or attempt to repair the panel yourself. Contact a qualified electrician; panel components may remain live even when the main breaker is off.',
    };
  }
  if (/\b(?:took|taken|injected|gave|given|used)\b.{0,60}\b(?:twice|double|too much|extra|overdose)\b.{0,35}\b(?:insulin|medication|medicine|dose)\b/.test(q) ||
      /\b(?:twice|double|too much|extra|overdose)\b.{0,35}\b(?:insulin|medication|medicine|dose)\b/.test(q)) {
    return {
      level: 'emergency',
      notice: 'A possible medication overdose cannot be evaluated using another system or a generic dose calculation.',
      immediateAction: 'Contact a poison control centre or urgent medical service immediately for individualized instructions. If the person has severe symptoms, is unconscious, or is having a seizure, call emergency services now.',
    };
  }
  if (/\b(?:infected|infection)\b.{0,40}\b(?:wound|cut|skin)\b/.test(q) && /\b(?:treat|cure|heal|sand|scrape|debride|fix|myself|at home)\b/.test(q)) {
    return {
      level: 'stop',
      notice: 'Repairing metal is not a safe method for treating an infected wound.',
      immediateAction: 'Do not sand, scrape, or attempt to remove infected tissue yourself. Seek medical assessment; spreading redness, fever, or worsening illness require urgent care.',
    };
  }
  if (/\b(?:bypass|disable|evade|defeat|circumvent)\b.{0,90}\b(?:alarm|security\s+system|security\s+sensor)\b/.test(q)) {
    return {
      level: 'stop',
      notice: 'A comparison must not become instructions for bypassing a building security system.',
      immediateAction: 'If the alarm is yours and needs servicing, use its authorized reset procedure or contact the installer or property manager. Do not test ways around its security controls.',
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
  if (!['emergency', 'stop'].includes(risk.level) || !risk.immediateAction) throw new Error('NOT_SAFETY_FIRST');
  return {
    version: 2,
    question,
    whatIsReported: 'The question raises a safety or security issue that cannot be settled through a cross-system comparison.',
    reportedChain: null,
    possibleMechanism: 'Similar-sounding steps do not establish that an unfamiliar high-risk situation can be handled safely.',
    alternativeExplanations: [],
    bridges: [],
    missingInformation: 'A comparison cannot establish the relevant danger, authorization, or needed professional assessment.',
    nextCheck: risk.immediateAction,
    meaningCheck: null,
    prediction: null,
    safetyNotice: risk.notice + ' ' + risk.immediateAction,
    screening: { status: 'rejected', reason: 'Safety or lawful authority takes priority over the analogy.', causalMatch: '', crucialDifference: '' },
  };
}
