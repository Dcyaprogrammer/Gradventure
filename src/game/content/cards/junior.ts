import type { Card } from "../../../types/card";
import { Phase } from "../../../types/game";
import { CHARACTER_IDS } from "../characters";

/**
 * 来源：升学内容.docx
 * - 中介机构选择与合同签订
 * - 雅思/托福等语言考试：规划与查要求
 *
 * 注：图片字段暂时留空；背景先用 scene 选择策略。
 */
export const juniorCards: Card[] = [
  {
    id: "card_agent_promises_001",
    category: "career",
    phase: Phase.Junior,
    character: CHARACTER_IDS.AgentConsultant,
    title: "中介签约",
    text: "顾问拍胸脯说“保证Top 10录取”。你怎么做？",
    background: { kind: "scene", scene: "office", preferCharacter: true },
    choices: {
      left: {
        id: "keep_screening",
        label: "警惕夸大承诺，继续筛选",
        effect: {
          stats: { mentalHealth: +2, careerCapital: +1 },
          resultText: "你保留主动权，少踩坑也更安心。",
          addFlags: ["agent_screening"],
        },
      },
      right: {
        id: "sign_immediately",
        label: "先签了再说",
        effect: {
          stats: { mentalHealth: -3 },
          resultText: "不确定性变大，后续更容易被动加压。",
          addFlags: ["agent_signed_risky"],
        },
      },
    },
    once: true,
  },
  {
    id: "card_agent_transparency_002",
    category: "career",
    phase: Phase.Junior,
    character: CHARACTER_IDS.AgentConsultant,
    title: "账号与知情权",
    text: "中介拒绝提供申请邮箱账号和密码，只说“我们全包”。你怎么选？",
    background: { kind: "scene", scene: "office", preferCharacter: true },
    choices: {
      left: {
        id: "demand_access",
        label: "必须共享账号与提交权限",
        effect: {
          stats: { mentalHealth: +1, careerCapital: +1 },
          resultText: "你拿回知情权，后续更可控。",
          addFlags: ["application_access_shared"],
          removeFlags: ["application_blackbox"],
        },
      },
      right: {
        id: "blackbox",
        label: "交给他们处理",
        effect: {
          stats: { mentalHealth: -2 },
          resultText: "你省了心，但也失去很多关键细节。",
          addFlags: ["application_blackbox"],
        },
      },
    },
  },
  {
    id: "card_agent_payment_003",
    category: "finance",
    phase: Phase.Junior,
    character: CHARACTER_IDS.AgentConsultant,
    title: "付款方式",
    text: "合同要求一次性付全款。你会？",
    background: { kind: "scene", scene: "office", preferCharacter: true },
    choices: {
      left: {
        id: "stage_payment",
        label: "坚持分阶段付款",
        effect: {
          stats: { mentalHealth: +1, careerCapital: +1 },
          resultText: "风险更可控，你也更有底气。",
          addFlags: ["payment_staged"],
        },
      },
      right: {
        id: "pay_all",
        label: "为了省事一次付清",
        effect: {
          stats: { mentalHealth: -2, careerCapital: 0 },
          resultText: "短期省事，但谈判筹码变少。",
          addFlags: ["payment_all_upfront"],
        },
      },
    },
  },
  {
    id: "card_language_timing_004",
    category: "study",
    phase: Phase.Junior,
    character: CHARACTER_IDS.EnglishTeacher,
    title: "语言考试时间点",
    text: "你准备申请秋季入学。语言成绩最好什么时候考出来？",
    background: { kind: "scene", scene: "classroom", preferCharacter: true },
    choices: {
      left: {
        id: "take_early",
        label: "暑假前后就考，预留刷分",
        effect: {
          stats: { mentalHealth: +2, careerCapital: +1 },
          resultText: "节奏更稳，后面文书与材料更从容。",
          addFlags: ["language_done_early"],
        },
      },
      right: {
        id: "take_late",
        label: "先不急，临近再说",
        effect: {
          stats: { mentalHealth: -2 },
          resultText: "时间窗口变窄，后期压力上来。",
          addFlags: ["language_delayed"],
        },
      },
    },
  },
  {
    id: "card_language_requirements_005",
    category: "study",
    phase: Phase.Junior,
    character: CHARACTER_IDS.SeniorStudent,
    title: "查清要求",
    text: "学长提醒：别只听中介，语言要求必须自己上官网查。你会？",
    background: { kind: "scene", scene: "library", preferCharacter: false },
    choices: {
      left: {
        id: "check_official",
        label: "自己上官网逐条核对",
        effect: {
          stats: { careerCapital: +1, mentalHealth: +1 },
          resultText: "信息更准确，也更能把握细节。",
          addFlags: ["requirements_verified"],
        },
      },
      right: {
        id: "trust_others",
        label: "听中介/朋友的就行",
        effect: {
          stats: { mentalHealth: -1 },
          resultText: "省事但风险更高，小分坑可能在后面爆雷。",
          addFlags: ["requirements_unverified"],
        },
      },
    },
  },
];

