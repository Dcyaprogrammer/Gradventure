import { Phase } from "../../../types/game";
import type { Card } from "../../../types/card";
import { juniorCards } from "./junior";
import { vacationCards } from "./vacation";

export const cardsByPhase: Record<Phase, Card[]> = {
  [Phase.Freshman]: [],
  [Phase.Sophomore]: [],
  [Phase.Junior]: juniorCards,
  [Phase.Senior]: [],
  [Phase.Vacation]: vacationCards,
};

export const allCards: Card[] = Object.values(cardsByPhase).flat();

