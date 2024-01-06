import { env } from "$env/dynamic/private";
import type { Player, Stats } from "$lib/types";
import { Firestore } from "firebase-admin/firestore";
import { DateTime } from "luxon";

export const load = async () => {
  const {
    FIRESTORE_EMULATOR_HOST,
    GCLOUD_PROJECT,
    GOOGLE_APPLICATION_CREDENTIALS,
  } = env;
  if (
    !GCLOUD_PROJECT ||
    (!FIRESTORE_EMULATOR_HOST && !GOOGLE_APPLICATION_CREDENTIALS)
  ) {
    return { events: [] };
  }

  const settings: FirebaseFirestore.Settings = FIRESTORE_EMULATOR_HOST
    ? {
        projectId: GCLOUD_PROJECT,
        host: FIRESTORE_EMULATOR_HOST,
        ssl: false,
      }
    : {
        projectId: GCLOUD_PROJECT,
        keyFilename: GOOGLE_APPLICATION_CREDENTIALS!,
      };
  const db = new Firestore(settings);

  const month = DateTime.local().toISODate()!.slice(0, 7);

  const stats = (await db
    .doc(`stats/${month}`)
    .get()
    .then((doc) => doc.data())) as Stats;

  const players = (await db
    .collection(`stats/${month}/players`)
    .get()
    .then(({ docs }) =>
      docs.map((doc) => ({ name: doc.id, ...doc.data() })),
    )) as Player[];

  return { stats, players };
};
