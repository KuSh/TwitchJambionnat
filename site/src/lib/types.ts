interface BaseEvent {
  type: string;
  timestamp: number;
}

export const BatteRoyalVictoryType = "battleroyale:victory";
export const MarblesVictoryType = "marbles:victory";

export interface BatteRoyalVictory extends BaseEvent {
  type: typeof BatteRoyalVictoryType;
  name: string;
  display_name: string;
}

export interface MarblesVictory extends BaseEvent {
  type: typeof MarblesVictoryType;
  name: string;
  display_name: string;
}

export type Event = BatteRoyalVictory | MarblesVictory;
