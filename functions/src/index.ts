import { initializeApp } from "firebase-admin/app";
import type { Timestamp } from "firebase-admin/firestore";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions/v2";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { Agent } from "https";
import { DateTime } from "luxon";
import fetch from "node-fetch";

const BasketBallVictoryType = "basketball:victory";
const BattleRoyalePoopType = "battleroyale:poop";
const BattleRoyaleVictoryType = "battleroyale:victory";
const DuelVictoryType = "duel:victory";
const GarticShowVictoryType = "garticshow:victory";
const MarblesVictoryType = "marbles:victory";
const SkyjoVictoryType = "skyjo:victory";

type EventType =
  | typeof BasketBallVictoryType
  | typeof BattleRoyalePoopType
  | typeof BattleRoyaleVictoryType
  | typeof DuelVictoryType
  | typeof GarticShowVictoryType
  | typeof MarblesVictoryType
  | typeof SkyjoVictoryType;

const INSTANT_TYPES = [
  BasketBallVictoryType,
  BattleRoyalePoopType,
  BattleRoyaleVictoryType,
  DuelVictoryType,
  GarticShowVictoryType,
];

const DELAYED_TYPES = [MarblesVictoryType, SkyjoVictoryType];

type BaseEvent<T extends EventType> = {
  type: T;
  timestamp: Timestamp;
  name: string;
  display_name: string;
  path?: string;
};

type BasketBallVictory = BaseEvent<typeof BasketBallVictoryType>;
type BattleRoyalePoop = BaseEvent<typeof BattleRoyalePoopType>;
type BattleRoyaleVictory = BaseEvent<typeof BattleRoyaleVictoryType>;
type DuelVictory = BaseEvent<typeof DuelVictoryType>;
type GarticShowVictory = BaseEvent<typeof GarticShowVictoryType>;
type MarblesVictory = BaseEvent<typeof MarblesVictoryType>;
type SkyjoVictory = BaseEvent<typeof SkyjoVictoryType>;

type Event =
  | BasketBallVictory
  | BattleRoyalePoop
  | BattleRoyaleVictory
  | DuelVictory
  | GarticShowVictory
  | MarblesVictory
  | SkyjoVictory;

const isValidEvent = (data: unknown): data is Event => {
  if (!data) return false;
  if (typeof data !== "object") return false;
  if (!("type" in data)) return false;
  const type = data["type"];
  if (typeof type !== "string") return false;
  return INSTANT_TYPES.concat(DELAYED_TYPES).includes(type);
};

initializeApp();
const db = getFirestore();
export const updateStats = async (event: Event) => {
  const isDelayed = DELAYED_TYPES.includes(event.type);

  const dt = DateTime.fromMillis(event.timestamp.toMillis());
  const date = (isDelayed ? dt.plus({ months: 1 }) : dt).toISODate()!;

  const year = date.slice(0, 4);
  const month = date.slice(0, 7);

  const col = db.collection("stats");

  await col
    .doc(year)
    .set({ [event.type]: FieldValue.increment(1) }, { merge: true });

  await col
    .doc(month)
    .set({ [event.type]: FieldValue.increment(1) }, { merge: true });

  const player = {
    display_name: event.display_name,
    path: event.path ?? FieldValue.delete(),
    [event.type]: FieldValue.increment(1),
  };

  await col.doc(`${month}/players/${event.name}`).set(player, { merge: true });
};

const agent = new Agent({ keepAlive: true });
export const launchWorkflow = async (event: Event) => {
  if (!INSTANT_TYPES.includes(event.type)) return true;

  // Don't launch cd workflow if on emulator
  if (process.env["FIRESTORE_EMULATOR_HOST"]) return true;

  const { GITHUB_REPOSITORY, GITHUB_TOKEN, GITHUB_WORKFLOW } = process.env;

  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/workflows/${GITHUB_WORKFLOW}/dispatches`,
    {
      agent,
      body: JSON.stringify({ ref: "main" }),
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    logger.error(
      `Status ${response.url} on ${response.status}`,
      await response.json(),
    );
    return false;
  }

  return true;
};

export const onEventCreated = onDocumentCreated(
  {
    document: "events/{docId}",
    region: "europe-west1",
    secrets: ["GITHUB_REPOSITORY", "GITHUB_TOKEN", "GITHUB_WORKFLOW"],
  },
  async (input) => {
    const event = input.data?.data();
    if (!isValidEvent(event)) return false;

    await updateStats(event);

    return launchWorkflow(event);
  },
);
