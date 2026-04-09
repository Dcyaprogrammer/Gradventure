import type { Background, BackgroundId } from "../../../types/background";
import { Phase } from "../../../types/game";
import { CHARACTER_IDS } from "../characters";

export const BACKGROUND_IDS = {
  ConsultantOffice: "bg_consultant_office",
  Classroom: "bg_classroom",
  DormDesk: "bg_dorm_desk",
  Library: "bg_library",
} as const satisfies Record<string, BackgroundId>;

export const backgrounds: Record<BackgroundId, Background> = {
  [BACKGROUND_IDS.ConsultantOffice]: {
    id: BACKGROUND_IDS.ConsultantOffice,
    imageKey: "",
    scene: "office",
    characters: [CHARACTER_IDS.AgentConsultant],
    mood: "neutral",
    weight: 3,
  },
  [BACKGROUND_IDS.Classroom]: {
    id: BACKGROUND_IDS.Classroom,
    imageKey: "",
    scene: "classroom",
    characters: [CHARACTER_IDS.EnglishTeacher],
    mood: "bright",
    weight: 2,
  },
  [BACKGROUND_IDS.DormDesk]: {
    id: BACKGROUND_IDS.DormDesk,
    imageKey: "",
    scene: "dorm",
    mood: "neutral",
    weight: 2,
  },
  [BACKGROUND_IDS.Library]: {
    id: BACKGROUND_IDS.Library,
    imageKey: "",
    scene: "library",
    phases: [Phase.Freshman, Phase.Sophomore, Phase.Junior, Phase.Senior],
    mood: "neutral",
    weight: 4,
  },
};

