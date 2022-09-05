import { logger, region } from "firebase-functions";

export const onCreateEvent = region("europe-west1")
  .runWith({
    secrets: ["GITHUB_TOKEN"],
  })
  .firestore.document("events/{docId}")
  .onCreate(async (change) => {
    if (change.data().type !== "basketball:victory") return;

    const { GITHUB_TOKEN } = process.env;
    const response = await fetch(
      "https://api.github.com/repos/KuSh/Twitch-SA-Leaderboard/actions/workflows/site.yml/dispatches",
      {
        method: "POST",
        body: JSON.stringify({ ref: "main" }),
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      logger.error(await response.json());
      return false;
    }

    return true;
  });
