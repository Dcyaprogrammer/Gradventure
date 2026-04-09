import type { CharacterId } from "./character";
import type { Phase } from "./game";

export type BackgroundId = string;
export type BackgroundImageKey = string;

/**
 * 背景场景标签：用于让背景不单调、便于按角色/剧情筛选
 * - 先保持为 string union，后续你可以按需要继续扩展
 */
export type BackgroundScene =
  | "classroom"
  | "office"
  | "dorm"
  | "library"
  | "lab"
  | "cafeteria"
  | "campus"
  | "home"
  | "interview_room"
  | "company"
  | "outdoor"
  | "generic";

/**
 * 一张卡可以：
 * - 明确指定一个背景（最精确）
 * - 或只给标签/候选池，让系统按角色与阶段挑一个
 */
export type BackgroundRef =
  | { kind: "id"; id: BackgroundId }
  | { kind: "scene"; scene: BackgroundScene; preferCharacter?: boolean };

/**
 * 背景资源本体（可做成你的“背景库 / 背景卡池”）
 */
export interface Background {
  id: BackgroundId;
  imageKey: BackgroundImageKey;
  scene: BackgroundScene;

  /**
   * 允许的阶段（不填表示任意阶段都可用）
   */
  phases?: Phase[];

  /**
   * 适配哪些角色（不填表示任意角色都可用）
   * - 例如老师常用 office/classroom；学生常用 dorm/classroom
   */
  characters?: CharacterId[];

  /**
   * 可选：用于调色/氛围（UI 层可以用来叠加滤镜）
   */
  mood?: "bright" | "neutral" | "dark";

  /**
   * 可选：抽取权重（当一张卡只指定 scene 时，用它来随机）
   */
  weight?: number;
}

