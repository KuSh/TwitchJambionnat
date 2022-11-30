type BaseEvent<T> = {
  type: T;
  timestamp: number;
  name: string;
  display_name: string;
};

export const BattleRoyaleVictoryType = "battleroyale:victory";
export const MarblesVictoryType = "marbles:victory";
export const BasketBallVictoryType = "basketball:victory";
export const DuelVictoryType = "duel:victory";

export type BattleRoyaleVictory = BaseEvent<typeof BattleRoyaleVictoryType>;
export type MarblesVictory = BaseEvent<typeof MarblesVictoryType>;
export type BasketBallVictory = BaseEvent<typeof BasketBallVictoryType>;
export type DuelVictory = BaseEvent<typeof DuelVictoryType>;

export type Event =
  | BattleRoyaleVictory
  | MarblesVictory
  | BasketBallVictory
  | DuelVictory;
