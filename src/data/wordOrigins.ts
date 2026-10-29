/**
 * Human-reviewed examples of two DIFFERENT questions:
 * where a word came from, and why a concept became associated with it.
 * This public reference material is not the private analogy-selection engine.
 * Do not imply that a metaphor proves a shared linguistic root or original intent.
 */
export interface WordOriginNote {
  kind: 'word-family-and-metaphor' | 'conceptual-association' | 'linguistic-origin';
  kindLabel: string;
  wordHistory: string;
  whyUsed: string;
  caution: string;
  sources: { label: string; url: string }[];
}

const ORIGIN_NOTES: Record<string, WordOriginNote> = {
  mother: {
    kind: 'word-family-and-metaphor',
    kindLabel: 'Word family + cultural association',
    wordHistory: 'English mother comes from Old English mōdor, related to Latin māter and Ancient Greek mētēr. Those words share linguistic ancestry.',
    whyUsed: 'In Hesiod’s Greek account, Gaia is the Earth and mother of divine beings. “Mother Earth” associates Earth with producing and sustaining life; it does not mean the English words mother and earth have the same root.',
    caution: 'This association is not universal. In Egyptian mythology, Geb represents Earth as male and Nut represents Sky as female. We can document the comparison without claiming that every storyteller intended the same message.',
    sources: [
      { label: 'Oxford English Dictionary · mother', url: 'https://doi.org/10.1093/OED/1525741166' },
      { label: 'Hesiod · Theogony', url: 'https://chs.harvard.edu/primary-source/hesiod-theogony-sb/' },
      { label: 'British Museum · Egyptian gods', url: 'https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-egypt/ancient-egyptian-gods-and-goddesses' },
    ],
  },
  earth: {
    kind: 'conceptual-association',
    kindLabel: 'Cultural association',
    wordHistory: 'Gaia is an ancient Greek name for Earth. Calling Earth a “mother” is a conceptual association, not proof that the words earth and mother came from the same linguistic root.',
    whyUsed: 'Greek mythology presents Earth as Gaia, a female deity who brings forth other beings. Motherhood is a familiar human relationship used to describe a life-producing natural world.',
    caution: 'Egyptian accounts represent Earth as the male god Geb. A gendered image belongs to a particular cultural account; it is not a property of Earth itself.',
    sources: [
      { label: 'Hesiod · Theogony', url: 'https://chs.harvard.edu/primary-source/hesiod-theogony-sb/' },
      { label: 'British Museum · Geb and Nut', url: 'https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-egypt/ancient-egyptian-gods-and-goddesses' },
    ],
  },
  hermeneutics: {
    kind: 'linguistic-origin',
    kindLabel: 'Interpretation + historical context',
    wordHistory: 'Hermeneutics comes through Greek hermēneutikos, concerned with interpretation, from hermēneuein, to interpret or explain. The further origin of that Greek verb is uncertain; a connection with the god Hermes is traditional, not established linguistic proof.',
    whyUsed: 'The practice first became especially associated with interpreting difficult texts, including scripture, and expanded into law, history, art and human communication. A meaning is checked by reading individual words against the larger text, its time, audience and purpose, then revisiting the whole.',
    caution: 'Interpreting a work is not the same as confirming what its author privately intended. A modern parallel is a proposed reading, not evidence that an ancient author described a modern technology or that two systems share a causal mechanism.',
    sources: [
      { label: 'St Andrews · Biblical Hermeneutics', url: 'https://www.saet.ac.uk/Christianity/BiblicalHermeneutics' },
      { label: 'Stanford Encyclopedia · Hermeneutics', url: 'https://plato.stanford.edu/entries/hermeneutics/' },
    ],
  },
  matrix: {
    kind: 'linguistic-origin',
    kindLabel: 'Linguistic origin',
    wordHistory: 'Latin mātrix comes from māter, “mother.” Early senses include a breeding female, a womb, and figuratively a source or origin.',
    whyUsed: 'Later uses of matrix describe an arrangement or surrounding structure in which things are held or formed. That is a meaning extension worth investigating, not proof that every modern matrix performs reproduction.',
    caution: 'A mathematical matrix is a defined array of values; its properties must be explained mathematically, not inferred from the original biological sense.',
    sources: [
      { label: 'University of Chicago · Latin mātrix', url: 'https://logeion.uchicago.edu/matrix' },
    ],
  },
};

export const getWordOrigin = (word: string): WordOriginNote | undefined =>
  ORIGIN_NOTES[word.trim().toLocaleLowerCase()];
