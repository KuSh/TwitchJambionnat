import type { Timestamp } from "firebase-admin/firestore";

export const BasketBallVictoryType = "basketball:victory";
export const BattleRoyalePoopType = "battleroyale:poop";
export const BattleRoyaleVictoryType = "battleroyale:victory";
export const DuelVictoryType = "duel:victory";
export const MarblesVictoryType = "marbles:victory";

export type EventType =
  | typeof BasketBallVictoryType
  | typeof BattleRoyalePoopType
  | typeof BattleRoyaleVictoryType
  | typeof DuelVictoryType
  | typeof MarblesVictoryType

export const INSTANT_TYPES = [
  BasketBallVictoryType,
  BattleRoyalePoopType,
  BattleRoyaleVictoryType,
  DuelVictoryType,
];

export const DELAYED_TYPES = [MarblesVictoryType];

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
export type MarblesVictory = BaseEvent<typeof MarblesVictoryType>;

export type Event =
  | BasketBallVictory
  | BattleRoyalePoop
  | BattleRoyaleVictory
  | DuelVictory
  | MarblesVictory;

export type Stats = Partial<Record<EventType, number>>;

export interface Player extends Stats {
  name: string;
  display_name: string;
  path?: string;
}
