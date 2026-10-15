import { TranslationResult, SavedJourneyItem } from '../types/translation';

const STORAGE_KEY = 'the_last_10_percent_history';
const JOURNEY_KEY = 'the_last_10_percent_journey_items';

export function getSavedHistory(): TranslationResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load history from localStorage', err);
    return [];
  }
}

export function saveToHistory(item: TranslationResult): void {
  try {
    const current = getSavedHistory();
    const filtered = current.filter((h) => h.id !== item.id && h.unfamiliarTopic !== item.unfamiliarTopic);
    const updated = [item, ...filtered].slice(0, 25);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save to localStorage', err);
  }
}

export function removeFromHistory(id: string): TranslationResult[] {
  try {
    const current = getSavedHistory();
    const updated = current.filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to remove from localStorage', err);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear localStorage', err);
  }
}

// Dedicated Journey Storage
export function getSavedJourneyItems(): SavedJourneyItem[] {
  try {
    const raw = localStorage.getItem(JOURNEY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load journey items', err);
    return [];
  }
}

export function saveJourneyItem(item: SavedJourneyItem): SavedJourneyItem[] {
  try {
    const current = getSavedJourneyItems();
    const filtered = current.filter((j) => j.id !== item.id && j.topic !== item.topic);
    const updated = [item, ...filtered].slice(0, 50);
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save journey item', err);
    return [];
  }
}

export function updateJourneyNotes(id: string, notes: string): SavedJourneyItem[] {
  try {
    const current = getSavedJourneyItems();
    const updated = current.map((j) => (j.id === id ? { ...j, userNotes: notes } : j));
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to update journey notes', err);
    return [];
  }
}

export function removeJourneyItem(id: string): SavedJourneyItem[] {
  try {
    const current = getSavedJourneyItems();
    const updated = current.filter((j) => j.id !== id);
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to remove journey item', err);
    return [];
  }
}

export function updateJourneyPrediction(id: string, record: import('../types/translation').TestablePredictionRecord): SavedJourneyItem[] {
  try {
    const current = getSavedJourneyItems();
    const updated = current.map((j) => (j.id === id ? { ...j, testableRecord: record } : j));
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to update prediction record', err);
    return [];
  }
}

export function clearAllJourney(): void {
  try {
    localStorage.removeItem(JOURNEY_KEY);
  } catch (err) {
    console.warn('Failed to clear journey items', err);
  }
}
