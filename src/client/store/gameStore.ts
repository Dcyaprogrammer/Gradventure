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

const MOCK_DECK: Card[] = [
  // ==========================================
  // START OF THE TIMELINE (SEPTEMBER)
  // ==========================================
  {
    id: "timeline_start",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "calendar",
    title: "September: The Crossroads",
    text: "Senior year begins. Grad school applications are looming. How will you tackle this journey?",
    stressLevel: "grind",
    choices: {
      left: {
        id: "hire_agency",
        label: "Hire Agency ($10k)",
        effect: { 
          stats: { mentality: 20, energy: 10, experience: -10 }, 
          resultText: "You signed a contract. Time to relax... right?",
          daysToAdvance: 30
        },
        nextCardId: "agency_1_handover"
      },
      right: {
        id: "diy",
        label: "DIY (Do It Yourself)",
        effect: { 
          stats: { mentality: -10, energy: -15, experience: 15 }, 
          resultText: "You opened 20 tabs of university requirements. It's on.",
          daysToAdvance: 30
        },
        nextCardId: "diy_1_ielts"
      }
    }
  },

  // ==========================================
  // BRANCH A: THE AGENCY ROUTE
  // ==========================================
  {
    id: "agency_1_handover",
    category: "AGENCY",
    phase: Phase.Year1,
    character: "consultant",
    title: "October: The Handover",
    text: "Your consultant asks for your application email password for 'unified management.'",
    stressLevel: "panic",
    choices: {
      left: {
        id: "give_password",
        label: "Sure, take it",
        effect: { 
          stats: { gpa: -10, mentality: 10, experience: -20 }, 
          resultText: "Out of sight, out of mind.",
          daysToAdvance: 30
        },
        nextCardId: "agency_2_ghosting_a"
      },
      right: {
        id: "refuse",
        label: "Absolutely Not",
        effect: { 
          stats: { energy: -20, mentality: -10, experience: 20 }, 
          resultText: "They are annoyed, but you retain control.",
          daysToAdvance: 30
        },
        nextCardId: "agency_2_ghosting_b"
      }
    }
  },
  {
    id: "agency_2_ghosting_a",
    category: "CRISIS",
    phase: Phase.Year1,
    character: "phone",
    title: "November: Radio Silence",
    text: "You haven't heard from the agency in 3 weeks. The deadline is approaching.",
    stressLevel: "panic",
    choices: {
      left: {
        id: "spam_call",
        label: "Spam Call Them",
        effect: { 
          stats: { energy: -25, mentality: -20 }, 
          resultText: "They finally picked up, but gave a vague excuse.",
          daysToAdvance: 30
        },
        nextCardId: "agency_3a_spamfolder"
      },
      right: {
        id: "wait",
        label: "Trust the Process",
        effect: { 
          stats: { mentality: 10, experience: -15 }, 
          resultText: "Ignorance is bliss... for now.",
          daysToAdvance: 30
        },
        nextCardId: "agency_3a_spamfolder"
      }
    }
  },
  {
    id: "agency_2_ghosting_b",
    category: "AGENCY",
    phase: Phase.Year1,
    character: "consultant",
    title: "November: The First Draft",
    text: "You finally forced them to send the essay draft. It's garbage.",
    stressLevel: "grind",
    choices: {
      left: {
        id: "rewrite",
        label: "Rewrite It",
        effect: { 
          stats: { energy: -30, gpa: 10, experience: 20 }, 
          resultText: "You are doing their job for them.",
          daysToAdvance: 15
        },
        nextCardId: "agency_2.5_materials"
      },
      right: {
        id: "complain",
        label: "Complain to Manager",
        effect: { 
          stats: { mentality: -25, energy: -10 }, 
          resultText: "They assigned a 'senior' consultant. Same garbage.",
          daysToAdvance: 15
        },
        nextCardId: "agency_2.5_materials"
      }
    }
  },
  {
    id: "agency_2.5_materials",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "folder",
    title: "Late November: Material Gathering",
    text: "The agency needs your transcripts and certificates. You lost the physical copies.",
    stressLevel: "panic",
    choices: {
      left: {
        id: "bribe_admin",
        label: "Beg School Admin",
        effect: { 
          stats: { mentality: -20, energy: -15 }, 
          resultText: "You stood in line for 4 hours, but got them.",
          daysToAdvance: 15
        },
        nextCardId: "agency_3b_template"
      },
      right: {
        id: "fake_it",
        label: "Forge Them",
        effect: { 
          stats: { gpa: -100 }, 
          resultText: "You got caught. Instant expulsion.",
          triggerGameOver: "Academic Fraud. You were caught forging documents and expelled."
        }
      }
    }
  },
  {
    id: "agency_3a_spamfolder",
    category: "CRISIS",
    phase: Phase.Year1,
    character: "email",
    title: "December: The Missed Interview",
    text: "You finally log in. The agency missed a Yale interview invite from 2 weeks ago.",
    stressLevel: "panic",
    choices: {
      left: {
        id: "rage",
        label: "Rage & Sue",
        effect: { 
          stats: { mentality: -30, energy: -30, experience: 15 }, 
          resultText: "You fired them. Time to apply alone.",
          daysToAdvance: 30
        },
        nextCardId: "agency_4_upsell"
      },
      right: {
        id: "cry",
        label: "Cry in Bed",
        effect: { 
          stats: { mentality: -40, energy: -15 }, 
          resultText: "Dreams crushed. You settle for safe schools.",
          daysToAdvance: 30
        },
        nextCardId: "agency_4_upsell"
      }
    }
  },
  {
    id: "agency_3b_template",
    category: "AGENCY",
    phase: Phase.Year1,
    character: "consultant",
    title: "December: The Template",
    text: "They refuse to use your rewritten essay. They insist their 'template' is proven.",
    stressLevel: "grind",
    choices: {
      left: {
        id: "accept",
        label: "Yield to 'Experts'",
        effect: { 
          stats: { gpa: -20, experience: -20 }, 
          resultText: "Your essay looks like 10,000 others.",
          daysToAdvance: 30
        },
        nextCardId: "agency_4_upsell"
      },
      right: {
        id: "rebel",
        label: "Submit Yours",
        effect: { 
          stats: { energy: -20, mentality: 10, experience: 20 }, 
          resultText: "You went rogue and submitted it yourself.",
          daysToAdvance: 30
        },
        nextCardId: "agency_4_upsell"
      }
    }
  },
  {
    id: "agency_4_upsell",
    category: "AGENCY",
    phase: Phase.Year1,
    character: "consultant",
    title: "January: The Upsell",
    text: "The agency claims your background is 'too weak' and demands $3k for a 'guaranteed internship' padding.",
    stressLevel: "panic",
    choices: {
      left: {
        id: "pay",
        label: "Pay the Ransom",
        effect: { 
          stats: { mentality: -20, experience: -15 }, 
          resultText: "It was a fake remote internship. Worthless.",
          daysToAdvance: 15
        },
        nextCardId: "agency_4.5_mock_interview"
      },
      right: {
        id: "refuse",
        label: "Refuse Firmly",
        effect: { 
          stats: { mentality: 15, energy: -10, experience: 10 }, 
          resultText: "You stood your ground.",
          daysToAdvance: 15
        },
        nextCardId: "agency_4.5_mock_interview"
      }
    }
  },
  {
    id: "agency_4.5_mock_interview",
    category: "PLANNING",
    phase: Phase.Year1,
    character: "consultant",
    title: "Late January: Mock Interview",
    text: "The agency's 'mock interviewer' just reads off a script and yawns.",
    stressLevel: "grind",
    choices: {
      left: {
        id: "follow_script",
        label: "Memorize Their Script",
        effect: { 
          stats: { mentality: -10, experience: -20 }, 
          resultText: "You sound robotic and unnatural.",
          daysToAdvance: 15
        },
        nextCardId: "final_push"
      },
      right: {
        id: "ignore_them",
        label: "Prepare Independently",
        effect: { 
          stats: { energy: -20, experience: 20 }, 
          resultText: "You stayed up watching YouTube guides.",
          daysToAdvance: 15
        },
        nextCardId: "final_push"
      }
    }
  },

  // ==========================================
  // BRANCH B: THE DIY ROUTE
  // ==========================================
  {
    id: "diy_1_ielts",
    category: "LANGUAGE",
    phase: Phase.Year1,
    character: "language_test",
    title: "October: The IELTS Grind",
    text: "You need a 7.5. Your practice tests are stuck at 6.5.",
    stressLevel: "grind",
    choices: {
      left: {
        id: "grind_tpo",
        label: "Grind Official Prep",
        effect: { 
          stats: { gpa: 15, energy: -30, experience: 15 }, 
          resultText: "Exhausting, but you secured the 7.5!",
          daysToAdvance: 30
        },
        nextCardId: "diy_2_gre"
      },
      right: {
        id: "pray",
        label: "Rely on Luck",
        effect: { 
          stats: { gpa: -20, mentality: 10, energy: 10 }, 
          resultText: "You got a 6.5. Say goodbye to top programs.",
          daysToAdvance: 30
        },
        nextCardId: "diy_2_gre"
      }
    }
  },
  {
    id: "diy_2_gre",
    category: "LANGUAGE",
    phase: Phase.Year1,
    character: "math_book",
    title: "November: The GRE",
    text: "Quant is easy, but Verbal is destroying your soul.",
    stressLevel: "panic",
    choices: {
      left: {
        id: "memorize",
        label: "Memorize 3000 Words",
        effect: { 
          stats: { energy: -35, mentality: -15, experience: 10 }, 
          resultText: "Your brain is fried, but you passed.",
          daysToAdvance: 15
        },
        nextCardId: "diy_2.5_research"
      },
      right: {
        id: "skip_gre",
        label: "Apply GRE-Optional",
        effect: { 
          stats: { gpa: -15, energy: 20 }, 
          resultText: "You saved energy, but your options are limited.",
          daysToAdvance: 15
        },
        nextCardId: "diy_2.5_research"
      }
    }
  },
  {
    id: "diy_2.5_research",
    category: "ACADEMIC",
    phase: Phase.Year1,
    character: "professor_x",
    title: "Late November: Research Lab",
    text: "You joined a lab to boost your resume, but the PhD mentor wants you to work 40 hours a week.",
    stressLevel: "grind",
    choices: {
      left: {
        id: "quit_lab",
        label: "Quit the Lab",
        effect: { 
          stats: { energy: 20, experience: -30 }, 
          resultText: "You have more time, but a weaker profile.",
          daysToAdvance: 15
        },
        nextCardId: "diy_3_selection"
      },
      right: {
        id: "overwork",
        label: "Do It All",
        effect: { 
          stats: { gpa: -10, mentality: -30, energy: -30, experience: 35 }, 
          resultText: "You barely sleep, but you get a co-authorship.",
          daysToAdvance: 15
        },
        nextCardId: "diy_3_selection"
      }
    }
  },
  {
    id: "diy_3_selection",
    category: "ACADEMIC",
    phase: Phase.Year1,
    character: "professor_x",
    title: "December: School Selection",
    text: "Time to build your application list.",
    stressLevel: "chill",
    choices: {
      left: {
        id: "all_reach",
        label: "All Ivy League",
        effect: { 
          stats: { mentality: 15, experience: -10 }, 
          resultText: "High risk, high reward... or total failure.",
          daysToAdvance: 30
        },
        nextCardId: "diy_4_recs"
      },
      right: {
        id: "balanced",
        label: "Balanced List",
        effect: { 
          stats: { mentality: -5, experience: 20 }, 
          resultText: "Safe, Target, Reach. A mature strategy.",
          daysToAdvance: 30
        },
        nextCardId: "diy_4_recs"
      }
    }
  },
  {
    id: "diy_4_recs",
    category: "SOCIAL",
    phase: Phase.Year1,
    character: "professor_x",
    title: "January: Recommendations",
    text: "Your favorite professor isn't replying to your reference letter request.",
    stressLevel: "panic",
    choices: {
      left: {
        id: "ambush",
        label: "Ambush Their Office",
        effect: { 
          stats: { energy: -15, mentality: -10, experience: 25 }, 
          resultText: "Awkward, but you got the signature.",
          daysToAdvance: 30
        },
        nextCardId: "diy_5_writer"
      },
      right: {
        id: "ask_ta",
        label: "Ask a TA Instead",
        effect: { 
          stats: { gpa: -15, experience: -15 }, 
          resultText: "A weak letter that carries no weight.",
          daysToAdvance: 30
        },
        nextCardId: "diy_5_writer"
      }
    }
  },
  {
    id: "diy_5_writer",
    category: "ACADEMIC",
    phase: Phase.Year1,
    character: "pencil",
    title: "February: Writer's Block",
    text: "Staring at a blank page for your Personal Statement.",
    stressLevel: "grind",
    choices: {
      left: {
        id: "use_ai",
        label: "Use ChatGPT",
        effect: { 
          stats: { gpa: -20, energy: 20, experience: -15 }, 
          resultText: "It sounds like a robot wrote it.",
          daysToAdvance: 15
        },
        nextCardId: "diy_5.5_interview"
      },
      right: {
        id: "struggle",
        label: "Write & Revise",
        effect: { 
          stats: { energy: -30, mentality: -15, experience: 25 }, 
          resultText: "Draft #10 is finally authentic.",
          daysToAdvance: 15
        },
        nextCardId: "diy_5.5_interview"
      }
    }
  },
  {
    id: "diy_5.5_interview",
    category: "SOCIAL",
    phase: Phase.Year1,
    character: "interviewer",
    title: "Late February: The Real Interview",
    text: "A top program invites you for a technical interview over Zoom.",
    stressLevel: "panic",
    choices: {
      left: {
        id: "cram",
        label: "Cram Technicals",
        effect: { 
          stats: { energy: -20, mentality: -15, experience: 30 }, 
          resultText: "You answered the coding question perfectly.",
          daysToAdvance: 15
        },
        nextCardId: "final_push"
      },
      right: {
        id: "wing_it",
        label: "Wing It",
        effect: { 
          stats: { experience: -40, mentality: -10 }, 
          resultText: "You blanked on a basic algorithm.",
          daysToAdvance: 15
        },
        nextCardId: "final_push"
      }
    }
  },

  // ==========================================
  // CONVERGENCE: THE ENDGAME
  // ==========================================
  {
    id: "final_push",
    category: "WAITING",
    phase: Phase.Year1,
    character: "calendar",
    title: "March: The Waiting Game",
    text: "Applications submitted. Now you wait. The anxiety is palpable.",
    stressLevel: "chill",
    choices: {
      left: {
        id: "doomscroll",
        label: "Doomscroll Forums",
        effect: { 
          stats: { mentality: -25, energy: -10 }, 
          resultText: "Seeing others get offers destroys your peace.",
          daysToAdvance: 30
        },
        nextCardId: "decision_day"
      },
      right: {
        id: "relax",
        label: "Find a Hobby",
        effect: { 
          stats: { mentality: 25, energy: 15 }, 
          resultText: "You start painting. It actually helps.",
          daysToAdvance: 30
        },
        nextCardId: "decision_day"
      }
    }
  },
  {
    id: "decision_day",
    category: "RESULTS",
    phase: Phase.Year1,
    character: "email",
    title: "April: Decision Day",
    text: "An email notification pops up: 'Status Update on Your Application.'",
    stressLevel: "panic",
    choices: {
      left: {
        id: "open_it",
        label: "Open It Now",
        effect: { 
          stats: { mentality: -10 }, 
          resultText: "The moment of truth...",
          daysToAdvance: 1,
          triggerGameOver: "DEMO COMPLETED! You survived the brutal application season. You got the offer!",
          isWin: true,
          currencyAward: 100
        }
      },
      right: {
        id: "wait",
        label: "Wait for Parents",
        effect: { 
          stats: { mentality: -20 }, 
          resultText: "The suspense is killing you.",
          daysToAdvance: 1,
          triggerGameOver: "DEMO COMPLETED! You survived the brutal application season. You got the offer!",
          isWin: true,
          currencyAward: 100
        }
      }
    }
  }
];

interface GameState {
  // Core Metrics (0-100)
  stats: Stats;
  
  // Game Progression
  currentDay: number; // The absolute total number of days elapsed since the game started
  currency: number; // Persistent across games
  hasSeenTutorial: boolean;
  
  // Current Card State
  deck: Card[];
  currentCard: Card | null;
  queuedCardId: string | null; // The ID of the card that MUST be drawn next (for sequential story branches)
  activeStressLevel: StressLevel;
  feedbackMessage: string | null; // Temporary message shown after making a choice
  
  // End State
  isGameOver: boolean;
  gameOverReason: string | null;
  isWin: boolean;

  // Actions
  initializeGame: () => void;
  makeChoice: (choice: CardChoice) => void;
  drawNextCard: () => void;
  applyStatChanges: (delta: Partial<Record<StatKey, number>>) => void;
  clearFeedback: () => void;
  spendCurrency: (amount: number) => boolean;
  completeTutorial: () => void;
}

// Helper constants for the calendar system
const DAYS_IN_YEAR = 360; // 12 months * 30 days for simplicity in game logic
const DAYS_IN_MONTH = 30;

// Helper to convert absolute days to a formatted date object
export const getFormattedDate = (totalDays: number) => {
  const year = Math.floor(totalDays / DAYS_IN_YEAR) + 1;
  const dayOfYear = totalDays % DAYS_IN_YEAR;
  
  const monthIndex = Math.floor(dayOfYear / DAYS_IN_MONTH);
  const dayOfMonth = (dayOfYear % DAYS_IN_MONTH) + 1;
  
  const monthNames = ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"];
  const currentMonth = monthNames[monthIndex];

  return { year, month: currentMonth, day: dayOfMonth };
};

const INITIAL_STATS: Stats = {
  gpa: 50,
  mentality: 50,
  energy: 50,
  experience: 50,
};

export const useGameStore = create<GameState>((set, get) => ({
  stats: { ...INITIAL_STATS },
  currentDay: 0,
  currency: 100,
  
  deck: [],
  currentCard: null,
  queuedCardId: null,
  activeStressLevel: 'grind',
  feedbackMessage: null,
  
  isGameOver: false,
  gameOverReason: null,
  isWin: false,
  hasSeenTutorial: false,

  initializeGame: () => {
    // For the demo, we always start with the specific starting card.
    const firstCard = MOCK_DECK.find(c => c.id === "timeline_start") || MOCK_DECK[0];
    
    set({
      stats: { ...INITIAL_STATS },
      currentDay: 0, // Starts at September 1st
      deck: MOCK_DECK, // We keep it for reference, but sequential drawing bypasses it mostly
      currentCard: firstCard,
      queuedCardId: null,
      activeStressLevel: firstCard?.stressLevel || 'grind',
      feedbackMessage: null,
      isGameOver: false,
      gameOverReason: null,
      isWin: false,
      hasSeenTutorial: false // For DEMO purposes: ALWAYS reset tutorial to false on new game
      // Notice we do NOT reset currency
    });
  },

  makeChoice: (choice: CardChoice) => {
    const { applyStatChanges, drawNextCard } = get();
    
    // Provide temporary feedback
    set({ feedbackMessage: `You chose: ${choice.label}` });

    // --- Check for Forced Game Over from Choice Effect (e.g. Victory or Instant Death) ---
    if (choice.effect.triggerGameOver) {
      set((state) => ({ 
        isGameOver: true, 
        gameOverReason: choice.effect.triggerGameOver!,
        isWin: choice.effect.isWin || false,
        currency: state.currency + (choice.effect.currencyAward || 0)
      }));
      return;
    }

    // Apply stat changes from the choice
    if (choice.effect.stats) {
      applyStatChanges(choice.effect.stats);
    }
    
    // --- Check standard game over conditions (Mid-game Failure) ---
    const currentStats = get().stats;
    if (currentStats.gpa <= 0) return set({ isGameOver: true, gameOverReason: "Academic Dismissal. Your GPA hit rock bottom." });
    if (currentStats.mentality <= 0) return set({ isGameOver: true, gameOverReason: "Burnout. You need to take a leave of absence." });
    if (currentStats.energy <= 0) return set({ isGameOver: true, gameOverReason: "Exhaustion. You collapsed and slept through finals week." });
    if (currentStats.experience <= 0) return set({ isGameOver: true, gameOverReason: "Blank Resume. You have absolutely no practical experience to show." });

    // Advance time based on the choice's specified time jump, or default to a small random bump
    const daysToAdvance = choice.effect.daysToAdvance || Math.floor(Math.random() * 3) + 1;
    
    // If this choice triggers a sequential story branch, queue it up!
    if (choice.nextCardId) {
      set({ queuedCardId: choice.nextCardId });
    }
    
    set((state) => ({ currentDay: state.currentDay + daysToAdvance }));
    drawNextCard();
  },

  clearFeedback: () => {
    set({ feedbackMessage: null });
  },

  drawNextCard: () => {
    const { deck, stats, currentCard, queuedCardId } = get();
    
    // --- 0. Sequential Story Branch Check (Highest Priority) ---
    if (queuedCardId) {
      // Find the card in the full mock deck (or database)
      const nextStoryCard = MOCK_DECK.find(c => c.id === queuedCardId) || SPECIAL_EVENTS[queuedCardId];
      if (nextStoryCard) {
        set({ 
          currentCard: nextStoryCard, 
          activeStressLevel: nextStoryCard.stressLevel || 'grind',
          queuedCardId: null // Clear the queue once drawn
        });
        return;
      }
    }

    // --- 1. Special Events Probability Check ---
    // If energy is critically low (< 20), there's a 30% chance to trigger an injury event
    if (stats.energy < 20 && Math.random() < 0.3) {
      const specialCard = SPECIAL_EVENTS["injury_low_energy"];
      // Ensure we don't trigger the exact same special card twice in a row
      if (specialCard && specialCard.id !== currentCard?.id) {
        set({ currentCard: specialCard, activeStressLevel: specialCard.stressLevel || 'panic' });
        return;
      }
    }
    
    // If mentality is critically low (< 20), there's a 30% chance to trigger a breakdown event
    if (stats.mentality < 20 && Math.random() < 0.3) {
      const specialCard = SPECIAL_EVENTS["breakdown_low_mental"];
      if (specialCard && specialCard.id !== currentCard?.id) {
        set({ currentCard: specialCard, activeStressLevel: specialCard.stressLevel || 'panic' });
        return;
      }
    }
    // ----------------------------------------

    if (deck.length <= 1) {
      // Reshuffle or end game if deck is empty. For demo, we just reshuffle the mock deck.
      const shuffledDeck = [...MOCK_DECK].sort(() => Math.random() - 0.5);
      
      // Ensure the first card of the new deck isn't the same as the last card we just played
      if (shuffledDeck[0].id === currentCard?.id && shuffledDeck.length > 1) {
        // Swap first and second card
        const temp = shuffledDeck[0];
        shuffledDeck[0] = shuffledDeck[1];
        shuffledDeck[1] = temp;
      }

      const nextCard = shuffledDeck[0];
      set({ 
        deck: shuffledDeck.slice(1),
        currentCard: nextCard,
        activeStressLevel: nextCard?.stressLevel || 'grind'
      });
    } else {
      // Pop the top card
      const nextCard = deck[1];
      
      // In our mock setup where we only have 2 cards, it's very likely to hit duplicates.
      // If the next card is exactly the same as the current one, and we have more cards,
      // skip it and draw the one after it to force variety.
      if (nextCard.id === currentCard?.id && deck.length > 2) {
        const alternativeCard = deck[2];
        const remainingDeck = [deck[1], ...deck.slice(3)]; // Put the duplicate back in the deck
        
        set({ 
          deck: remainingDeck,
          currentCard: alternativeCard,
          activeStressLevel: alternativeCard?.stressLevel || 'grind'
        });
        return;
      }

      set({ 
        deck: deck.slice(1),
        currentCard: nextCard,
        activeStressLevel: nextCard?.stressLevel || 'grind'
      });
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
  },

  spendCurrency: (amount: number) => {
    const current = get().currency;
    if (current >= amount) {
      set({ currency: current - amount });
      return true;
    }
    return false;
  },
  completeTutorial: () => set({ hasSeenTutorial: true })
}));
