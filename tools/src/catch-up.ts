import { Firestore } from "@google-cloud/firestore";
import dotenv from "dotenv";
import { DateTime } from "luxon";
import fetch from "node-fetch";

dotenv.config();

const events = (
  type: string,
  events: { name: string; timestamp: Date }[]
): { type: string; name: string; timestamp: Date }[] =>
  events.map(({ name, timestamp }) => ({ type, name, timestamp }));

const EVENTS = [
  ...events("battleroyale:victory", [
    {
      name: "uaeruz",
      timestamp: DateTime.local(2022, 11, 30, 21, 47)
        .plus({ minutes: 6, seconds: 10 })
        .toJSDate(),
    },
  ]),
  ...events("marbles:victory", [
    {
      name: "uaeruz",
      timestamp: DateTime.local(2022, 11, 30, 21, 47)
        .plus({ minutes: 6, seconds: 10 })
        .toJSDate(),
    },
  ]),
  ...events("duel:victory", [
    {
      name: "uaeruz",
      timestamp: DateTime.local(2022, 11, 30, 21, 47)
        .plus({ minutes: 6, seconds: 10 })
        .toJSDate(),
    },
  ]),
];

type TwitchUser = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
  created_at: string;
};
const twitchGetUsers = async (ids: Iterable<string>): Promise<TwitchUser[]> => {
  const { TWITCH_ACCESS_TOKEN, TWITCH_CLIENT_ID } = process.env;

  const params = new URLSearchParams(
    Array.from(new Set(ids)).map((id) => ["login", id] as [string, string])
  );

  return fetch(`https://api.twitch.tv/helix/users?${params}`, {
    headers: {
      Authorization: `Bearer ${TWITCH_ACCESS_TOKEN}`,
      "Client-Id": `${TWITCH_CLIENT_ID}`,
    },
  })
    .then((r) => r.json() as Promise<{ data: TwitchUser[] }>)
    .then((b) => b.data);
};

const catchUp = async () => {
  const {
    GOOGLE_APPLICATION_CREDENTIALS,
    FIRESTORE_EMULATOR_HOST,
    GCLOUD_PROJECT,
  } = process.env;

  const users = await twitchGetUsers(EVENTS.map(({ name }) => name)).then((r) =>
    r.reduce(
      (acc, { login, display_name }) => acc.set(login, display_name),
      new Map<string, string>()
    )
  );

  const events = EVENTS.map(({ type, name, timestamp }) => ({
    type,
    timestamp,
    name,
    display_name: users.get(name),
  }));

  const db = await new Firestore({
    projectId: GCLOUD_PROJECT,
    keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
    host: FIRESTORE_EMULATOR_HOST,
    ssl: FIRESTORE_EMULATOR_HOST ? false : undefined,
  }).collection("events");

  await Promise.all(
    events.map((event) =>
      db.add(event).then(() => console.log(JSON.stringify(event), "added!"))
    )
  );
};

catchUp();
