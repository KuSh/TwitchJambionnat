import { env } from "$env/dynamic/private";
import { CURRENT_TYPES, DELAYED_TYPES, type Event } from "$lib/types";
import type { QueryDocumentSnapshot, Timestamp } from "@google-cloud/firestore";
import { Firestore } from "@google-cloud/firestore";
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
    FIRESTORE_EMULATOR_HOST,
    GCLOUD_PROJECT,
    GOOGLE_APPLICATION_CREDENTIALS,
  } = env;
  if (!GCLOUD_PROJECT || !GOOGLE_APPLICATION_CREDENTIALS) return { events: [] };

  const settings: FirebaseFirestore.Settings = FIRESTORE_EMULATOR_HOST
    ? {
        projectId: GCLOUD_PROJECT,
        keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
        host: FIRESTORE_EMULATOR_HOST,
        ssl: false,
      }
    : {
        projectId: GCLOUD_PROJECT,
        keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
      };
  const db = new Firestore(settings).collection("events");

  const startOfMonth = DateTime.local().startOf("month");

  const current = await db
    .where("type", "in", CURRENT_TYPES)
    .where("timestamp", ">=", startOfMonth.toJSDate())
    .get()
    .then(({ docs }) => docs.map(map));

  const delayed = await db
    .where("type", "in", DELAYED_TYPES)
    .where("timestamp", ">=", startOfMonth.minus({ months: 1 }).toJSDate())
    .where("timestamp", "<", startOfMonth.toJSDate())
    .get()
    .then(({ docs }) => docs.map(map));

  return { events: current.concat(delayed) };
};
