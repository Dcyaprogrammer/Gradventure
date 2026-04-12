import { create } from 'zustand';
import type { Stats, StatKey } from '../../types/game';
import { Phase } from '../../types/game';
import type { Card, CardChoice, StressLevel } from '../../types/card';

// Define some special event cards that are not in the regular deck
const SPECIAL_EVENTS: Record<string, Card> = {
  "injury_low_energy": {
    id: "injury_low_energy",
    category: "health",
    phase: Phase.Year1,
    character: "gym_coach",
    title: "Pulled Muscle!",
    text: "You forced yourself to PE class and pulled a muscle.",
    stressLevel: "panic",
    triggerType: "special_event",
    choices: {
      left: {
        id: "go_hospital",
        label: "Hospital",
        effect: { stats: { mentality: -15, energy: 10 }, resultText: "Expensive, but you got some rest." }
      },
      right: {
        id: "ignore_it",
        label: "Walk it off",
        effect: { stats: { energy: -20, gpa: -5 }, resultText: "It got worse. You couldn't focus in class." }
      }
    }
  },
  "breakdown_low_mental": {
    id: "breakdown_low_mental",
    category: "health",
    phase: Phase.Year1,
    character: "therapist",
    title: "Burnout",
    text: "You stared at a blank screen for 4 hours crying. Burnout.",
    stressLevel: "panic",
    triggerType: "special_event",
    choices: {
      left: {
        id: "take_break",
        label: "Take a Break",
        effect: { stats: { mentality: 30, gpa: -15 }, resultText: "You missed a deadline, but you feel human again." }
      },
      right: {
        id: "push_through",
        label: "Keep Working",
        effect: { stats: { mentality: -20, energy: -20 }, resultText: "You wrote 10 lines of code. It's all buggy." }
      }
    }
  }
};

// We will hardcode a few cards for the demo, but they will be loaded dynamically later.
const MOCK_DECK: Card[] = [
  {
    id: "demo_1",
    category: "study",
    phase: Phase.Year1,
    character: "professor_x",
    title: "The First Assignment",
    text: "HCI assignment due tomorrow. Perfection or sleep?",
    stressLevel: "grind",
    choices: {
      left: {
        id: "pull_all_nighter",
        label: "All-Nighter",
        effect: {
          stats: { gpa: 10, energy: -20, mentality: -10, experience: 5 },
          resultText: "You got an A, but you feel like a zombie."
        }
      },
      right: {
        id: "sleep",
        label: "Sleep",
        effect: {
          stats: { gpa: -10, energy: 20, mentality: 10 },
          resultText: "You got a B-, but your skin looks great."
        }
      }
    }
  },
  {
    id: "demo_2",
    category: "social",
    phase: Phase.Year1,
    character: "roommate",
    title: "Party Invite",
    text: "Massive party tonight. Great networking, but you have a reading to finish.",
    stressLevel: "chill",
    choices: {
      left: {
        id: "go_party",
        label: "Go Party",
        effect: {
          stats: { mentality: 15, experience: 10, gpa: -5, energy: -10 },
          resultText: "You met some cool seniors! But what reading?"
        }
      },
      right: {
        id: "stay_home",
        label: "Study",
        effect: {
          stats: { gpa: 10, mentality: -10, energy: 5 },
          resultText: "You finished the reading. FOMO is hitting hard though."
        }
      }
    }
  }
];

interface GameState {
  // Core Metrics (0-100)
  stats: Stats;
  
  // Game Progression
  currentPhase: Phase;
  currentMonth: number; // 1 to 12
  
  // Current Card State
  deck: Card[];
  currentCard: Card | null;
  activeStressLevel: StressLevel;
  
  // End State
  isGameOver: boolean;
  gameOverReason: string | null;

  // Actions
  initializeGame: () => void;
  makeChoice: (choice: CardChoice) => void;
  drawNextCard: () => void;
  applyStatChanges: (delta: Partial<Record<StatKey, number>>) => void;
}

const INITIAL_STATS: Stats = {
  gpa: 50,
  mentality: 50,
  energy: 50,
  experience: 50,
};

export const useGameStore = create<GameState>((set, get) => ({
  stats: { ...INITIAL_STATS },
  currentPhase: Phase.Year1,
  currentMonth: 1,
  
  deck: [],
  currentCard: null,
  activeStressLevel: 'grind',
  
  isGameOver: false,
  gameOverReason: null,

  initializeGame: () => {
    // In the future, we fetch deck from Supabase. For now, use MOCK_DECK.
    const shuffledDeck = [...MOCK_DECK].sort(() => Math.random() - 0.5);
    const firstCard = shuffledDeck[0] || null;
    
    set({
      stats: { ...INITIAL_STATS },
      currentPhase: Phase.Year1,
      currentMonth: 1,
      deck: shuffledDeck,
      currentCard: firstCard,
      activeStressLevel: firstCard?.stressLevel || 'grind',
      isGameOver: false,
      gameOverReason: null
    });
  },

  makeChoice: (choice: CardChoice) => {
    const { applyStatChanges, drawNextCard } = get();
    
    // Apply stat changes from the choice
    if (choice.effect.stats) {
      applyStatChanges(choice.effect.stats);
    }
    
    // Check game over conditions
    const currentStats = get().stats;
    if (currentStats.gpa <= 0) {
      set({ isGameOver: true, gameOverReason: "Academic Dismissal. Your GPA hit rock bottom." });
      return;
    }
    if (currentStats.mentality <= 0) {
      set({ isGameOver: true, gameOverReason: "Mental Breakdown. You need a gap year." });
      return;
    }
    if (currentStats.energy <= 0) {
      set({ isGameOver: true, gameOverReason: "Exhaustion. You passed out in the library." });
      return;
    }

    // Advance time
    let nextMonth = get().currentMonth + 1;
    let nextPhase = get().currentPhase;
    
    if (nextMonth > 12) {
      nextMonth = 1;
      if (nextPhase === Phase.Year1) nextPhase = Phase.Year2;
      else if (nextPhase === Phase.Year2) nextPhase = Phase.Year3;
      else {
        // Won the game
        set({ isGameOver: true, gameOverReason: "GRADUATED! You survived the HCI program." });
        return;
      }
    }
    
    set({ currentMonth: nextMonth, currentPhase: nextPhase });
    drawNextCard();
  },

  drawNextCard: () => {
    const { deck, stats } = get();
    
    // --- Special Events Probability Check ---
    // If energy is critically low (< 20), there's a 30% chance to trigger an injury event
    if (stats.energy < 20 && Math.random() < 0.3) {
      const specialCard = SPECIAL_EVENTS["injury_low_energy"];
      set({ currentCard: specialCard, activeStressLevel: specialCard.stressLevel || 'panic' });
      return;
    }
    
    // If mentality is critically low (< 20), there's a 30% chance to trigger a breakdown event
    if (stats.mentality < 20 && Math.random() < 0.3) {
      const specialCard = SPECIAL_EVENTS["breakdown_low_mental"];
      set({ currentCard: specialCard, activeStressLevel: specialCard.stressLevel || 'panic' });
      return;
    }
    // ----------------------------------------

    if (deck.length <= 1) {
      // Reshuffle or end game if deck is empty. For demo, we just reshuffle the mock deck.
      const shuffledDeck = [...MOCK_DECK].sort(() => Math.random() - 0.5);
      const nextCard = shuffledDeck[0];
      set({ deck: shuffledDeck, currentCard: nextCard, activeStressLevel: nextCard?.stressLevel || 'grind' });
    } else {
      const newDeck = deck.slice(1);
      const nextCard = newDeck[0];
      set({ deck: newDeck, currentCard: nextCard, activeStressLevel: nextCard?.stressLevel || 'grind' });
    }
  },

  applyStatChanges: (delta) => {
    set((state) => {
      const newStats = { ...state.stats };
      (Object.keys(delta) as StatKey[]).forEach((key) => {
        if (delta[key] !== undefined) {
          // Clamp values between 0 and 100
          newStats[key] = Math.max(0, Math.min(100, newStats[key] + delta[key]!));
        }
      });
      return { stats: newStats };
    });
  }
}));
