interface BaseEvent {
  type: string;
  timestamp: number;
}

export const BattleRoyaleVictoryType = "battleroyale:victory";
export const MarblesVictoryType = "marbles:victory";

export interface BattleRoyaleVictory extends BaseEvent {
  type: typeof BattleRoyaleVictoryType;
  name: string;
  display_name: string;
}

export interface MarblesVictory extends BaseEvent {
  type: typeof MarblesVictoryType;
  name: string;
  display_name: string;
}

export type Event = BattleRoyaleVictory | MarblesVictory;
