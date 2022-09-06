import { env } from "$env/dynamic/private";
import {
  BatteRoyalVictoryType,
  MarblesVictoryType,
  type BatteRoyalVictory,
  type MarblesVictory,
} from "$lib/types";
import { Firestore } from "@google-cloud/firestore";
import { DateTime } from "luxon";

export const load = async () => {
  const {
    GOOGLE_APPLICATION_CREDENTIALS,
    FIRESTORE_EMULATOR_HOST,
    GCLOUD_PROJECT,
  } = env;

  const victories = new Firestore({
    projectId: GCLOUD_PROJECT,
    keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
    host: FIRESTORE_EMULATOR_HOST,
    ssl: FIRESTORE_EMULATOR_HOST ? false : undefined,
  })
    .collection("events")
    .where("type", "in", [BatteRoyalVictoryType, MarblesVictoryType])
    .where("timestamp", ">=", DateTime.local().startOf("month").toJSDate())
    .get()
    .then(({ docs }) =>
      docs.map((doc) => {
        const { timestamp, ...rest } = doc.data();
        return {
          timestamp: timestamp.toMillis(),
          ...rest,
        } as BatteRoyalVictory | MarblesVictory;
      })
    );

  return { victories };
};
