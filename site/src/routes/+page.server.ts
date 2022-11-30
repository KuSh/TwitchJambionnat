import { env } from "$env/dynamic/private";
import {
  BasketBallVictoryType,
  BattleRoyaleVictoryType,
  DuelVictoryType,
  MarblesVictoryType,
  type Event,
} from "$lib/types";
import {
  Firestore,
  QueryDocumentSnapshot,
  Timestamp,
} from "@google-cloud/firestore";
import { DateTime } from "luxon";

type EventDocument = Omit<Event, "timestamp"> & { timestamp: Timestamp };

const map = (doc: QueryDocumentSnapshot): Event => {
  const { timestamp, ...rest } = doc.data() as EventDocument;
  return {
    timestamp: timestamp.toMillis(),
    ...rest,
  };
};

export const load = async () => {
  const {
    GOOGLE_APPLICATION_CREDENTIALS,
    FIRESTORE_EMULATOR_HOST,
    GCLOUD_PROJECT,
  } = env;

  const db = new Firestore({
    projectId: GCLOUD_PROJECT,
    keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
    host: FIRESTORE_EMULATOR_HOST,
    ssl: FIRESTORE_EMULATOR_HOST ? false : undefined,
  }).collection("events");

  const startOfMonth = DateTime.local().startOf("month");

  const events = await db
    .where("type", "in", [
      BattleRoyaleVictoryType,
      BasketBallVictoryType,
      DuelVictoryType,
    ])
    .where("timestamp", ">=", startOfMonth.toJSDate())
    .get()
    .then(({ docs }) => docs.map(map));

  const marbles = await db
    .where("type", "==", MarblesVictoryType)
    .where("timestamp", ">=", startOfMonth.minus({ months: 1 }).toJSDate())
    .where("timestamp", "<", startOfMonth.toJSDate())
    .get()
    .then(({ docs }) => docs.map(map));

  return { events: events.concat(marbles) };
};
