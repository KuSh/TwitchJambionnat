type BaseEvent<T> = {
  type: T;
  timestamp: number;
  name: string;
  display_name: string;
  path?: string;
};

export const BasketBallVictoryType = "basketball:victory";
export const BattleRoyalePoopType = "battleroyale:poop";
export const BattleRoyaleVictoryType = "battleroyale:victory";
export const DuelVictoryType = "duel:victory";
export const GarticShowVictoryType = "garticshow:victory";
export const MarblesVictoryType = "marbles:victory";
export const SkyjoVictoryType = "skyjo:victory";

export const CURRENT_TYPES = [
  BasketBallVictoryType,
  BattleRoyalePoopType,
  BattleRoyaleVictoryType,
  DuelVictoryType,
  GarticShowVictoryType,
];
export const DELAYED_TYPES = [MarblesVictoryType, SkyjoVictoryType];

export type BasketBallVictory = BaseEvent<typeof BasketBallVictoryType>;
export type BattleRoyalePoop = BaseEvent<typeof BattleRoyalePoopType>;
export type BattleRoyaleVictory = BaseEvent<typeof BattleRoyaleVictoryType>;
export type DuelVictory = BaseEvent<typeof DuelVictoryType>;
export type GarticShowVictory = BaseEvent<typeof GarticShowVictoryType>;
export type MarblesVictory = BaseEvent<typeof MarblesVictoryType>;
export type SkyjoVictory = BaseEvent<typeof SkyjoVictoryType>;

export type Event =
  | BasketBallVictory
  | BattleRoyalePoop
  | BattleRoyaleVictory
  | DuelVictory
  | GarticShowVictory
  | MarblesVictory
  | SkyjoVictory;
