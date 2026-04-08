export type CharacterId = string;

/**
 * 角色图片资源 key
 * - 在 RN 里你可以把它映射到 require(...)，或映射到远端 URL
 */
export type CharacterImageKey = string;

/**
 * 游戏角色（用于卡片对话发起者、头像/立绘来源等）
 */
export interface Character {
  id: CharacterId;
  name: string;

  /**
   * 用于绑定角色照片/立绘的资源 key
   */
  imageKey: CharacterImageKey;

  /**
   * 可选：一句话人设/备注（用于调试或角色介绍页）
   */
  bio?: string;

  /**
   * 可选：角色标签（例如：导师/同学/家人/HR）
   * - 用 string 是为了方便后期扩展
   */
  tags?: string[];
}

