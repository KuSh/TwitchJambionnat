import dotenv from "dotenv";
import { Firestore } from "firebase-admin/firestore";

dotenv.config();

void (async () => {
  const {
    FIRESTORE_EMULATOR_HOST,
    GCLOUD_PROJECT,
    GOOGLE_APPLICATION_CREDENTIALS,
  } = process.env;
  if (!GCLOUD_PROJECT || !GOOGLE_APPLICATION_CREDENTIALS) {
    console.error(
      "GCLOUD_PROJECT and/or GOOGLE_APPLICATION_CREDENTIALS are not defined",
    );
    process.exit(1);
  }

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

  const events = await db
    .where("name", "==", "uaeruz_")
    .get()
    .then(({ docs }) => docs.map((doc) => doc.ref));

  await Promise.all(
    events.map((event) =>
      event.update({
        name: "uaeruz",
        display_name: "Uaeruz",
        path: "uaeruz_",
      }),
    ),
  );
})();
