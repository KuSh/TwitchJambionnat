interface BaseEvent {
  type: string;
  timestamp: number;
}

export const BatteRoyalVictoryType = "battleroyale:victory";

export interface BatteRoyalVictory extends BaseEvent {
  type: typeof BatteRoyalVictoryType;
  name: string;
  display_name: string;
}

export type Event = BatteRoyalVictory;
