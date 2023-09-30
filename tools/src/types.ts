import type { Timestamp } from "firebase-admin/firestore";

export const BasketBallVictoryType = "basketball:victory";
export const BattleRoyalePoopType = "battleroyale:poop";
export const BattleRoyaleVictoryType = "battleroyale:victory";
export const DuelVictoryType = "duel:victory";
export const GarticShowVictoryType = "garticshow:victory";
export const MarblesVictoryType = "marbles:victory";
export const SkyjoVictoryType = "skyjo:victory";

export type EventType =
  | typeof BasketBallVictoryType
  | typeof BattleRoyalePoopType
  | typeof BattleRoyaleVictoryType
  | typeof DuelVictoryType
  | typeof GarticShowVictoryType
  | typeof MarblesVictoryType
  | typeof SkyjoVictoryType;

export const INSTANT_TYPES = [
  BasketBallVictoryType,
  BattleRoyalePoopType,
  BattleRoyaleVictoryType,
  DuelVictoryType,
  GarticShowVictoryType,
];

export const DELAYED_TYPES = [MarblesVictoryType, SkyjoVictoryType];

type BaseEvent<T extends EventType> = {
  type: T;
  timestamp: Timestamp;
  name: string;
  display_name: string;
  path?: string;
};

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

export type Stats = Partial<Record<EventType, number>>;

export interface Player extends Stats {
  name: string;
  display_name: string;
  path?: string;
}
