export type CardId = string;
import type { CharacterId } from "./character";
import type { StatKey } from "./game";
import { Phase } from "./game";
import type { BackgroundRef } from "./background";

/**
 * 卡片类型（可按你游戏内容继续扩展）
 * - 用 string union 的方式，比 enum 更容易随内容增长
 */
export type CardCategory =
  | "study"
  | "social"
  | "health"
  | "career"
  | "finance"
  | "family"
  | "random_event"
  | "tutorial";

export type SwipeDirection = "left" | "right";

/**
 * 情感压力分级（决定 UI 主题）
 * - chill: 轻松（日常、休息、社团）-> 亮色/圆滑 UI
 * - grind: 努力（上课、做作业、实习）-> 经典粗野主义 UI
 * - panic: 极限高压（赶 DDL、挂科边缘、受伤）-> 红色/Glitch 警告 UI
 */
export type StressLevel = "chill" | "grind" | "panic";

/**
 * 触发类型
 * - normal: 普通卡池随机抽取
 * - special_event: 强制插入的特殊事件（满足条件必定触发）
 */
export type TriggerType = "normal" | "special_event";

/**
 * 对 stats 的增量变化（正/负皆可）
 * - 用 Partial 允许只改动某几个值
 */
export type StatDelta = Partial<Record<StatKey, number>>;

/**
 * 选择后效果：最核心的是对 Stats 的影响；也预留一些常用扩展位
 */
export interface CardEffect {
  stats?: StatDelta;
  /**
   * 可选：给玩家一句“结果反馈”
   * - 例如：你熬夜赶 due，GPA 小涨但精神掉了
   */
  resultText?: string;
  /**
   * 可选：给“卡池/剧情”一个钩子，用于生成后续卡片或跳转剧情节点
   * - 例：选择实习 → 推入一组 career 相关卡
   */
  nextCardIds?: CardId[];
  /**
   * 可选：一次性事件/解锁标记
   * - 用 string 而不是 enum，方便后期添加
   */
  addFlags?: string[];
  removeFlags?: string[];
}

/**
 * 一侧（左/右）滑动代表一个选项
 */
export interface CardChoice {
  id: string;
  label: string;
  effect: CardEffect;
}

/**
 * 触发条件：决定“这张卡何时能出现”
 * - 先用最通用的字段；后续需要更复杂（表达式/脚本）再升级
 */
export interface CardRequirements {
  phases?: Phase[]; // 只在这些阶段出现
  requiredFlags?: string[]; // 必须拥有的标记
  excludedFlags?: string[]; // 不能拥有的标记
  /**
   * 可选：数值区间限制（例如精神过低才会触发某些卡）
   */
  statMin?: Partial<Record<StatKey, number>>;
  statMax?: Partial<Record<StatKey, number>>;
}

/**
 * UI 资源引用：把“数据”与“图片资源”解耦
 * - 在 RN 里你最终可能会把它映射到 require(...) 或远端 URL
 */
export interface CardAssets {
  /**
   * 角色头像/照片资源 key（由 CharacterId 决定也行；这里留一个覆盖口）
   */
  characterImageKey?: string;
}

/**
 * Reigns 风格卡片：标题/正文 + 角色 + 左右选项
 */
export interface Card {
  id: CardId;
  category: CardCategory;
  phase: Phase;
  character: CharacterId;

  title?: string;
  text: string;

  /**
   * 卡片背景：
   * - 可直接指定背景 id，或只指定场景让系统按角色/阶段挑选
   * - 若不填，推荐由角色默认背景或全局默认背景兜底
   */
  background?: BackgroundRef;

  /**
   * 卡片的情感压力分级（UI 渲染依据）
   * 默认情况下，如果没有传，可以按 category 映射或 fallback 到 "grind"
   */
  stressLevel?: StressLevel;

  /**
   * 卡片的触发机制（随机抽卡 vs 强制触发的特殊事件）
   * 默认 "normal"
   */
  triggerType?: TriggerType;

  /**
   * 特殊事件触发概率（0 - 1.0）
   * 仅在满足 requirements 的情况下，每回合有概率被强制插入队列顶端
   */
  triggerProbability?: number;

  /**
   * 左右滑分别对应一个 choice
   * - 为什么不用 left/right 两个字段：以后要做“多方向/按钮”扩展更自然
   */
  choices: Record<SwipeDirection, CardChoice>;

  requirements?: CardRequirements;
  assets?: CardAssets;

  /**
   * 卡池权重：用于随机抽卡（越大越容易出现）
   * - 不需要随机时可以不用
   */
  weight?: number;

  /**
   * 是否一次性：被打出后从卡池移除
   */
  once?: boolean;
}

