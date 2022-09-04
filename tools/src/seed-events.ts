import { faker } from "@faker-js/faker/locale/fr";
import { Firestore } from "@google-cloud/firestore";
import dotenv from "dotenv";

const seedEvents = async () => {
  dotenv.config();

  const { GCLOUD_PROJECT, FIRESTORE_EMULATOR_HOST } = process.env;

  const TYPES = [
    "battleroyale:victory",
    "battleroyale:poop",
    "basketball:victory",
  ];

  if (!FIRESTORE_EMULATOR_HOST) {
    console.error("FIRESTORE_EMULATOR_HOST is not defined");
    process.exit(1);
  }

  const db = new Firestore({
    projectId: GCLOUD_PROJECT,
    host: FIRESTORE_EMULATOR_HOST,
    ssl: false,
  });
  const events = db.collection("events");

  const USERS = Array.from({
    length: Math.ceil(10 + Math.random() * 10),
  }).map(() => {
    const display_name = faker.internet.userName();
    return { name: display_name.toLowerCase(), display_name };
  });

  await Promise.all(
    Array.from({
      length: Math.ceil(30 + Math.random() * 20),
    }).map((_, i) => {
      const type = i % 3 ? TYPES[0] : faker.helpers.arrayElement(TYPES);
      const timestamp =
        i % 3
          ? faker.date.recent(new Date().getDate() - 1)
          : faker.date.between(-60, 30);
      const { name, display_name } = faker.helpers.arrayElement(USERS);
      return events.add({ type, timestamp, name, display_name });
    })
  );
};

seedEvents();
