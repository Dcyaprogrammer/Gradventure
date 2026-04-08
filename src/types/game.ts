/**
 * 游戏全局“阶段”（学年/假期）
 * - 统一从这里导出，避免各处重复定义
 */
export enum Phase {
  Freshman = "freshman",
  Sophomore = "sophomore",
  Junior = "junior",
  Senior = "senior",
  Vacation = "vacation",
}

/**
 * 升学系统的四个核心指标（Reigns 风格：少而精）
 *
 * - gpa: 学业表现
 * - mentalHealth: 精神/心理状态
 * - careerCapital: “软背景/履历资本”（科研、实习、项目、竞赛等积累）
 */
export interface Stats {
  gpa: number;
  mentalHealth: number;
  careerCapital: number;
}

export type StatKey = keyof Stats;

