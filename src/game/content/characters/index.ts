import type { Character, CharacterId } from "../../../types/character";

export const CHARACTER_IDS = {
  AgentConsultant: "agent_consultant",
  EnglishTeacher: "english_teacher",
  SeniorStudent: "senior_student",
} as const satisfies Record<string, CharacterId>;

export const characters: Record<CharacterId, Character> = {
  [CHARACTER_IDS.AgentConsultant]: {
    id: CHARACTER_IDS.AgentConsultant,
    name: "留学中介顾问",
    imageKey: "",
    tags: ["中介", "申请"],
  },
  [CHARACTER_IDS.EnglishTeacher]: {
    id: CHARACTER_IDS.EnglishTeacher,
    name: "语言老师",
    imageKey: "",
    tags: ["语言考试", "学习"],
  },
  [CHARACTER_IDS.SeniorStudent]: {
    id: CHARACTER_IDS.SeniorStudent,
    name: "学长/学姐",
    imageKey: "",
    tags: ["经验分享", "申请"],
  },
};

