/**
 * 游戏全局“阶段”（学年/假期）
 * - 统一从这里导出，避免各处重复定义
 */
export enum Phase {
  Year1 = "year1",
  Year2 = "year2",
  Year3 = "year3",
}

/**
 * 升学系统的四个核心指标 (Based on product.md)
 *
 * - gpa: 学业表现 (GPA)
 * - mentality: 精神/心理状态 (Mentality)
 * - energy: 精力/体力 (Energy)
 * - experience: 经验/履历资本 (Experience)
 */
export interface Stats {
  gpa: number;
  mentality: number;
  energy: number;
  experience: number;
}

export type StatKey = keyof Stats;

