import type { Card } from "../../../types/card";
import { Phase } from "../../../types/game";
import { CHARACTER_IDS } from "../characters";

/**
 * 假期阶段：把“备考资源/刷分窗口”做成更贴近假期的卡。
 */
export const vacationCards: Card[] = [
  {
    id: "card_vacation_prep_resources_001",
    category: "study",
    phase: Phase.Vacation,
    character: CHARACTER_IDS.EnglishTeacher,
    title: "备考资源",
    text: "老师说：OG、剑桥真题/托福TPO 是最核心的材料。你的假期计划是？",
    background: { kind: "scene", scene: "dorm", preferCharacter: false },
    choices: {
      left: {
        id: "follow_core",
        label: "用核心材料系统刷题",
        effect: {
          stats: { mentalHealth: +1, careerCapital: +1 },
          resultText: "目标明确，投入更有效率。",
          addFlags: ["prep_core_materials"],
        },
      },
      right: {
        id: "random_resources",
        label: "到处找偏门资料",
        effect: {
          stats: { mentalHealth: -1 },
          resultText: "信息噪声太大，容易越学越焦虑。",
          addFlags: ["prep_scattered"],
        },
      },
    },
  },
  {
    id: "card_vacation_retake_window_002",
    category: "health",
    phase: Phase.Vacation,
    character: CHARACTER_IDS.SeniorStudent,
    title: "刷分窗口",
    text: "学长提醒：出分要时间，最好预留二战窗口。你会怎么安排？",
    background: { kind: "scene", scene: "library", preferCharacter: false },
    choices: {
      left: {
        id: "buffer_time",
        label: "留出二战与出分时间",
        effect: {
          stats: { mentalHealth: +2, careerCapital: +1 },
          resultText: "你把不确定性提前消化掉了。",
          addFlags: ["retake_buffered"],
        },
      },
      right: {
        id: "tight_schedule",
        label: "卡着DDL考一次就够",
        effect: {
          stats: { mentalHealth: -2 },
          resultText: "计划太紧，意外一来就容易崩盘。",
          addFlags: ["retake_risky"],
        },
      },
    },
  },
];

