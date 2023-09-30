import { faker } from "@faker-js/faker/locale/fr";
import dotenv from "dotenv";
import { Firestore } from "firebase-admin/firestore";
import { BattleRoyaleVictoryType, DELAYED_TYPES, INSTANT_TYPES } from "./types";

const seedEvents = async () => {
  dotenv.config();

  const { FIRESTORE_EMULATOR_HOST, GCLOUD_PROJECT } = process.env;

  if (!FIRESTORE_EMULATOR_HOST || !GCLOUD_PROJECT) {
    console.error(
      "FIRESTORE_EMULATOR_HOST and/or GCLOUD_PROJECT are not defined",
    );
    process.exit(1);
  }

  const TYPES = INSTANT_TYPES.concat(DELAYED_TYPES);
  const BR_INDEX = TYPES.indexOf(BattleRoyaleVictoryType);

  const db = new Firestore({
    projectId: GCLOUD_PROJECT,
    host: FIRESTORE_EMULATOR_HOST,
    ssl: false,
  });
  const events = db.collection("events");

  const USERS = Array.from({
    length: Math.ceil(30 + Math.random() * 10),
  }).map(() => {
    const display_name = faker.internet.userName();
    return { name: display_name.toLowerCase(), display_name };
  });

  await Promise.all(
    Array.from({
      length: Math.ceil(300 + Math.random() * 50),
    }).map((_, i) => {
      const type = i % 3 ? TYPES[BR_INDEX] : faker.helpers.arrayElement(TYPES);
      const timestamp =
        i % 3
          ? faker.date.recent({ days: 1 })
          : faker.date.between({
              from: new Date().getTime() - 60 * 86400000,
              to: new Date().getTime() + 30 * 86400000,
            });
      const { name, display_name } = faker.helpers.arrayElement(USERS);
      return events.add({ type, timestamp, name, display_name });
    }),
  );
};

void seedEvents();
