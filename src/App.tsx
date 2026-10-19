/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomTabBar } from './components/BottomTabBar';
import { LetsTalkScreen } from './components/screens/LetsTalkScreen';
import { ShowMeScreen } from './components/screens/ShowMeScreen';
import { MyDiscoveriesScreen } from './components/screens/MyDiscoveriesScreen';
import { UnderstandingMomentModal } from './components/UnderstandingMomentModal';
import { AuthModal } from './components/AuthModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import {
  ScreenId,
  TranslationResult,
  SavedJourneyItem,
  ActiveProblemContext,
  PracticalOutsideAction,
  UnderstandingMomentFeedback,
  MystiqueDomain,
  ChatMessage,
  TestablePredictionRecord,
  AutonomousDiscoveryJob,
} from './types/translation';
import { EXAMPLE_TOPICS } from './data/examples';
import {
  getSavedHistory,
  saveToHistory,
  getSavedJourneyItems,
  saveJourneyItem,
  updateJourneyNotes,
  updateJourneyPrediction,
  removeJourneyItem,
  clearAllJourney,
} from './utils/storage';
import { useAuth } from './context/AuthContext';
import { doc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './services/firebase';
import { AlertCircle, Loader2, X, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const screenTransition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1] as const,
};

const screenVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export default function App() {
  const { user, getIdToken } = useAuth();
  // 1. One Simple Starting Point: default to 'talk' ("What's on your mind?")
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('talk');
  const [activeTranslation, setActiveTranslation] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Listening and exploring connections...');
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAttempt, setLastAttempt] = useState<{ unfamiliar: string; familiar: string } | null>(null);

  // Mystique Principle: Adaptive Explanations
  const [mystiqueDomain, setMystiqueDomain] = useState<MystiqueDomain>('everyday');

  // Conversational Chat History in "Let's Talk"
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Saved Discoveries (combines all saved items)
  const [journeyItems, setJourneyItems] = useState<SavedJourneyItem[]>([]);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isUnderstandingMomentOpen, setIsUnderstandingMomentOpen] = useState(false);

  // Active Problem Context
  const [activeProblemContext, setActiveProblemContext] = useState<ActiveProblemContext | null>(null);

  // Independent Discovery Engine: Notifications & Tab routing
  const [autonomousInitialTab, setAutonomousInitialTab] = useState<'all' | 'autonomous' | 'predictions'>('all');
  const [discoveryNotification, setDiscoveryNotification] = useState<AutonomousDiscoveryJob | null>(null);

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {};
    if (user && getIdToken) {
      try {
        const token = await getIdToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
      } catch {
        // fallback
      }
    }
    if (user?.uid) {
      headers['x-user-id'] = user.uid;
    }
    return headers;
  };

  useEffect(() => {
    const checkAutonomousJobs = async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch('/api/discovery-jobs', { headers });
        if (res.ok) {
          const data = await res.json();
          const unnotified = (data.jobs || []).find(
            (j: AutonomousDiscoveryJob) => j.status === 'completed' && !j.wasNotified
          );
          if (unnotified) {
            setDiscoveryNotification(unnotified);
          }
        }
      } catch {
        // ignore
      }
    };
    checkAutonomousJobs();
    const interval = setInterval(checkAutonomousJobs, 18000);
    return () => clearInterval(interval);
  }, [user]);

  const handleOpenNotification = async () => {
    if (discoveryNotification) {
      try {
        const headers = await getAuthHeaders();
        await fetch(`/api/discovery-jobs/${discoveryNotification.id}/mark-notified`, {
          method: 'POST',
          headers,
        });
      } catch {
        // ignore
      }
      setDiscoveryNotification(null);
      setAutonomousInitialTab('autonomous');
      setCurrentScreen('discoveries');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDismissNotification = async () => {
    if (discoveryNotification) {
      try {
        const headers = await getAuthHeaders();
        await fetch(`/api/discovery-jobs/${discoveryNotification.id}/mark-notified`, {
          method: 'POST',
          headers,
        });
      } catch {
        // ignore
      }
      setDiscoveryNotification(null);
    }
  };

  const handleSaveExternalJourneyItem = async (newItem: SavedJourneyItem) => {
    const updated = saveJourneyItem(newItem);
    setJourneyItems(updated);
    if (user) {
      try {
        const itemRef = doc(db, 'users', user.uid, 'explorations', newItem.id);
        await setDoc(itemRef, newItem);
      } catch (err) {
        console.warn('Could not sync to Firestore:', err);
      }
    }
  };

  // Load initial journey items from storage & sync with Firestore when user logs in
  useEffect(() => {
    const localItems = getSavedJourneyItems();
    setJourneyItems(localItems);

    if (user) {
      const loadFirestoreItems = async () => {
        try {
          const colRef = collection(db, 'users', user.uid, 'explorations');
          const snap = await getDocs(colRef);
          if (!snap.empty) {
            const firestoreItems: SavedJourneyItem[] = [];
            snap.forEach((d) => {
              firestoreItems.push(d.data() as SavedJourneyItem);
            });
            const merged = [...firestoreItems, ...localItems.filter((l) => !firestoreItems.some((f) => f.id === l.id))];
            setJourneyItems(merged);
          }
        } catch (err) {
          console.warn('Firestore sync failed, using local storage:', err);
        }
      };
      loadFirestoreItems();
    }
  }, [user]);

  // Conversational loading messages
  useEffect(() => {
    if (!isLoading) return;
    const messages = [
      'Finding the right everyday comparison...',
      'Looking at how the pieces connect...',
      'Checking where the comparison fits and where it stops...',
      'Asking what we might be missing here...',
      'Putting it into plain English...',
    ];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setLoadingMessage(messages[idx]);
    }, 2000);
    return () => clearInterval(timer);
  }, [isLoading]);

  // Domain map for Mystique Lens
  const domainLabels: Record<MystiqueDomain, string> = {
    everyday: 'Everyday life & ordinary experiences',
    driving: 'Cars, traffic & getting lost',
    cooking: 'Cooking, recipes & kitchen chemistry',
    relationships: 'Relationships, family & friends',
    work: 'Work, bosses & team dynamics',
    sports: 'Sports, games & coaching',
    fixing: 'Fixing things & household plumbing',
    tech: 'Phones, social media & technology',
  };

  // Main Let's Talk Handler
  const handleSendMessage = async (query: string, domain?: string) => {
    setIsLoading(true);
    setError(null);
    const chosenDomain = domain || domainLabels[mystiqueDomain];
    setLastAttempt({ unfamiliar: query, familiar: chosenDomain });

    // Append user message to chat history
    setChatHistory((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: query,
        timestamp: Date.now(),
      },
    ]);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unfamiliarTopic: query,
          familiarDomain: chosenDomain,
          mode: 'standard',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to explore topic.');
      }

      setActiveTranslation(data);
      saveToHistory(data);

      setActiveProblemContext({
        id: `ctx-${Date.now()}`,
        originalQuery: query,
        extractedTopic: query,
        targetScreen: 'talk',
        triageReason: `Exploring through ${chosenDomain}`,
        suggestedFamiliarDomain: chosenDomain,
        alternativeScreens: [],
        understandingState: 'untested',
      });

      let assistantContent = `${data.headlineSummary}\n\n${data.section1Connects.narrative || data.frameworkFlow.translation}`;
      if (data.predictionTestResult) {
        assistantContent += `\n\n📊 Verified NASA Battery B0005 Results:\n• Observed: Cycles 1–${data.predictionTestResult.splitCycle} (First 60%)\n• Withheld: Cycles ${data.predictionTestResult.splitCycle + 1}–${data.predictionTestResult.totalCyclesOrSamples} (Remaining 40%)\n• Actual EOL: Cycle ${data.predictionTestResult.actualEolCycle} (1.40 Ah threshold)\n• Physics Model Predicted EOL: Cycle ${data.predictionTestResult.modelPredictedEolCycle} (Error: ${data.predictionTestResult.eolCycleError} cycles)\n• Linear Baseline Predicted EOL: Cycle ${data.predictionTestResult.baselinePredictedEolCycle?.toFixed(1)} (Error: ${data.predictionTestResult.baselineEolCycleError.toFixed(1)} cycles)\n• Model RMSE: ${data.predictionTestResult.modelRmse} Ah | Baseline RMSE: ${data.predictionTestResult.baselineRmse} Ah`;
      }

      // Append assistant's conversational response
      setChatHistory((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: assistantContent,
          timestamp: Date.now(),
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Could not explore topic right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Conversational Follow-Up Handler
  const handleFollowUp = async (question: string) => {
    if (!activeTranslation) return;

    // Add user question to chat
    setChatHistory((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: question,
        timestamp: Date.now(),
      },
    ]);

    try {
      const response = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          currentTranslation: activeTranslation,
          chatHistory,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not answer follow-up.');
      }

      setChatHistory((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: data.answer || "That's an interesting point to think about.",
          timestamp: Date.now(),
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: "Hang on, I couldn't reach the server just now. But think about how that same thing happens when people talk past each other.",
          timestamp: Date.now(),
        },
      ]);
    }
  };

  // Save to My Discoveries
  const handleSaveDiscovery = async () => {
    if (!activeTranslation) return;

    const basePred = activeTranslation.predictions?.[0];
    const initialTestableRecord: TestablePredictionRecord | undefined = basePred
      ? {
          id: basePred.id,
          topic: activeTranslation.unfamiliarTopic,
          dateCreated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          predictionSummary: basePred.scenario,
          assumptions: basePred.influencingFactors || [],
          whatCouldChangeIt: basePred.whatCouldChangeIt || '',
          howToTest: basePred.verificationTest.howWeFindOut || '',
          falsificationCriteria: basePred.verificationTest.falsificationSign || '',
          outcomeMatch: 'pending',
        }
      : undefined;

    const newItem: SavedJourneyItem = {
      id: `discovery-${Date.now()}`,
      topic: activeTranslation.unfamiliarTopic,
      domain: activeTranslation.familiarDomain,
      headline: activeTranslation.headlineSummary,
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      translation: activeTranslation,
      unresolvedQuestions: activeTranslation.section3Missing.questionsToAsk.slice(0, 3),
      userNotes: '',
      predictions: activeTranslation.predictions,
      crossFieldDiscoveries: activeTranslation.crossFieldDiscoveries,
      testableRecord: initialTestableRecord,
    };

    const updated = saveJourneyItem(newItem);
    setJourneyItems(updated);

    if (user) {
      try {
        const itemRef = doc(db, 'users', user.uid, 'explorations', newItem.id);
        await setDoc(itemRef, newItem);
      } catch (err) {
        console.warn('Could not sync to Firestore:', err);
      }
    }
  };

  const handleUpdatePredictionRecord = async (id: string, record: TestablePredictionRecord) => {
    const updated = updateJourneyPrediction(id, record);
    setJourneyItems(updated);

    // Track outcome with server analytics calibration
    try {
      fetch('/api/record-prediction-outcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          predictionId: record.id,
          topic: record.topic,
          predictionSummary: record.predictionSummary,
          actualResult: record.actualResult,
          outcomeMatch: record.outcomeMatch,
          learningNote: record.learningNote,
        }),
      }).catch(() => {});
    } catch {}

    if (user) {
      try {
        const itemRef = doc(db, 'users', user.uid, 'explorations', id);
        await setDoc(itemRef, { testableRecord: record }, { merge: true });
      } catch (err) {
        console.warn('Could not sync prediction record to Firestore:', err);
      }
    }
  };

  const handleUpdateNotes = async (id: string, notes: string) => {
    const updated = updateJourneyNotes(id, notes);
    setJourneyItems(updated);

    if (user) {
      try {
        const itemRef = doc(db, 'users', user.uid, 'explorations', id);
        await setDoc(itemRef, { userNotes: notes }, { merge: true });
      } catch (err) {
        console.warn('Could not sync notes to Firestore:', err);
      }
    }
  };

  const handleRemoveJourneyItem = async (id: string) => {
    const updated = removeJourneyItem(id);
    setJourneyItems(updated);

    if (user) {
      try {
        const itemRef = doc(db, 'users', user.uid, 'explorations', id);
        await deleteDoc(itemRef);
      } catch (err) {
        console.warn('Could not delete in Firestore:', err);
      }
    }
  };

  const handleClearAllJourney = () => {
    clearAllJourney();
    setJourneyItems([]);
  };

  const handleStartOver = () => {
    setActiveTranslation(null);
    setChatHistory([]);
    setError(null);
    setCurrentScreen('talk');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentSaved = Boolean(
    activeTranslation && journeyItems.some((j) => j.topic === activeTranslation.unfamiliarTopic)
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-teal-500/30 selection:text-teal-200 pb-20">
      {/* Top Header with 3 Core Tabs & Mystique Lens */}
      <Header
        currentScreen={currentScreen}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartOver={handleStartOver}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        hasActiveTranslation={Boolean(activeTranslation)}
        savedCount={journeyItems.length}
      />

      {/* Global Error Banner */}
      {error && (
        <div className="max-w-3xl mx-auto px-4 pt-4 w-full">
          <div className="p-4 rounded-2xl bg-slate-900 border border-rose-800/80 text-rose-200 shadow-xl flex items-start gap-3 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block text-white">Notice:</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Multi-Screen Viewport */}
      <main className="flex-1 px-4 sm:px-6 pt-4 pb-12 w-full max-w-5xl mx-auto overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {isLoading ? (
            <motion.div
              key="loading"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={screenTransition}
              className="bg-slate-850 rounded-3xl border border-slate-800 shadow-xl p-10 sm:p-14 text-center space-y-4 max-w-lg mx-auto my-12"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Exploring What Connects
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                {loadingMessage}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={currentScreen}
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={screenTransition}
              className="w-full"
            >
              {/* AREA 1: LET'S TALK */}
              {(currentScreen === 'talk' || currentScreen === 'discover') && (
                <LetsTalkScreen
                  onSendMessage={handleSendMessage}
                  onFollowUp={handleFollowUp}
                  onNavigateToShowMe={() => {
                    setCurrentScreen('visual');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onSaveDiscovery={handleSaveDiscovery}
                  isSaved={isCurrentSaved}
                  isLoading={isLoading}
                  activeTranslation={activeTranslation}
                  chatHistory={chatHistory}
                  mystiqueDomain={mystiqueDomain}
                  onChangeMystiqueDomain={(d) => {
                    setMystiqueDomain(d);
                    if (activeTranslation) {
                      handleSendMessage(activeTranslation.unfamiliarTopic, domainLabels[d]);
                    }
                  }}
                />
              )}

              {/* AREA 2: SHOW ME */}
              {(currentScreen === 'visual' ||
                currentScreen === 'understand' ||
                currentScreen === 'missing_engine' ||
                currentScreen === 'same_story' ||
                currentScreen === 'uncover' ||
                currentScreen === 'reality' ||
                currentScreen === 'move_forward') && (
                <ShowMeScreen
                  translation={activeTranslation}
                  onNavigateToTalk={(topic) => {
                    setCurrentScreen('talk');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  mystiqueDomain={mystiqueDomain}
                  onChangeMystiqueDomain={(d) => {
                    setMystiqueDomain(d);
                    if (activeTranslation) {
                      handleSendMessage(activeTranslation.unfamiliarTopic, domainLabels[d]);
                    }
                  }}
                  onAdaptAnalogy={(analogy) => {
                    if (activeTranslation) {
                      handleSendMessage(activeTranslation.unfamiliarTopic, analogy);
                    }
                  }}
                  onStartExample={(topic, domain) => {
                    handleSendMessage(topic, domain);
                    setCurrentScreen('visual');
                  }}
                />
              )}

              {/* AREA 3: MY DISCOVERIES */}
              {(currentScreen === 'discoveries' || currentScreen === 'journey') && (
                <MyDiscoveriesScreen
                  savedItems={journeyItems}
                  initialTab={autonomousInitialTab}
                  onOpenInTalk={(item) => {
                    if (item.translation) {
                      setActiveTranslation(item.translation);
                    }
                    setCurrentScreen('talk');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenInShowMe={(item) => {
                    if (item.translation) {
                      setActiveTranslation(item.translation);
                    }
                    setCurrentScreen('visual');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onUpdateNotes={handleUpdateNotes}
                  onUpdatePredictionRecord={handleUpdatePredictionRecord}
                  onSaveItem={handleSaveExternalJourneyItem}
                  onRemoveItem={handleRemoveJourneyItem}
                  onClearAll={handleClearAllJourney}
                  onNavigateToTalk={() => {
                    setCurrentScreen('talk');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Real-Time Background Discovery Notification Toast */}
      {discoveryNotification && (
        <div className="fixed bottom-20 right-4 left-4 sm:left-auto sm:max-w-md z-50 bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-2xl p-4 text-xs animate-fadeIn space-y-2 backdrop-blur-md">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono uppercase text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Independent Discovery Completed</span>
            </div>
            <button
              type="button"
              onClick={handleDismissNotification}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="font-bold text-white text-xs sm:text-sm">
            &ldquo;{discoveryNotification.conversationalHeadline}&rdquo;
          </p>
          <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
            <strong>{discoveryNotification.title}:</strong> {discoveryNotification.plainEnglishSummary}
          </p>
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleDismissNotification}
              className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs"
            >
              Later
            </button>
            <button
              type="button"
              onClick={handleOpenNotification}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <span>View in My Discoveries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile-First Bottom Tab Bar: 3 Main Destinations */}
      <BottomTabBar
        currentScreen={currentScreen}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        hasActiveTranslation={Boolean(activeTranslation)}
        savedCount={journeyItems.length}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* How It Works Modal */}
      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
    </div>
  );
}
