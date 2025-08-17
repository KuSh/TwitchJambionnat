import {
  FIRESTORE_EMULATOR_HOST,
  GCLOUD_PROJECT,
  GOOGLE_APPLICATION_CREDENTIALS,
} from "$env/static/private";
import type { Player, Scores, Stats } from "$lib/types";
import { Firestore } from "firebase-admin/firestore";
import { DateTime } from "luxon";
import type { PageServerLoad } from "./$types";

const score = ({
  "basketball:victory": baskets = 0,
  "battleroyale:victory": battles = 0,
  "duel:victory": duels = 0,
  "garticshow:victory": gartics = 0,
  "marbles:victory": marbles = 0,
  "skyjo:victory": skyjos = 0,
}: Stats) => {
  return battles + duels + 3 * (baskets + gartics) + 5 * (marbles + skyjos);
};

export const load: PageServerLoad = async (): Promise<
  undefined | { stats: Stats; scores: Scores }
> => {
  if (
    !GCLOUD_PROJECT ||
    (!FIRESTORE_EMULATOR_HOST && !GOOGLE_APPLICATION_CREDENTIALS)
  ) {
    return undefined;
  }

  const settings: FirebaseFirestore.Settings = FIRESTORE_EMULATOR_HOST
    ? {
        projectId: GCLOUD_PROJECT,
        host: FIRESTORE_EMULATOR_HOST,
        ssl: false,
      }
    : {
        projectId: GCLOUD_PROJECT,
        keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
      };
  const db = new Firestore(settings);

  const month = DateTime.local().toISODate().slice(0, 7);

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

  const scores = players
    .map((player) => ({ ...player, score: score(player) }))
    .sort(
      (a, b) =>
        b.score - a.score || a.display_name.localeCompare(b.display_name),
    )
    .reduce<Scores>((scores, player, index) => {
      return scores.set(player.score, [
        ...(scores.get(player.score) ?? []),
        { ...player, index },
      ]);
    }, new Map());

  return { stats, scores };
};
