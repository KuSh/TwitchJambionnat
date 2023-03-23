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
  if (!TWITCH_ACCESS_TOKEN)
    throw ReferenceError("TWITCH_ACCESS_TOKEN not defined");
  if (!TWITCH_CLIENT_ID) throw ReferenceError("TWITCH_CLIENT_ID not defined");

  const params = new URLSearchParams(
    Array.from(new Set(ids)).map((id) => ["login", id] as [string, string])
  ).toString();

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
    FIRESTORE_EMULATOR_HOST,
    GCLOUD_PROJECT,
    GOOGLE_APPLICATION_CREDENTIALS,
  } = process.env;
  if (!GCLOUD_PROJECT || !GOOGLE_APPLICATION_CREDENTIALS) {
    console.error(
      "GCLOUD_PROJECT and/or GOOGLE_APPLICATION_CREDENTIALS are not defined"
    );
    process.exit(1);
  }

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

  await Promise.all(
    events.map((event) =>
      db.add(event).then(() => console.log(JSON.stringify(event), "added!"))
    )
  );
};

void catchUp();
