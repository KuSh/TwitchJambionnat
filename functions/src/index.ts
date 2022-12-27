import { logger, region } from "firebase-functions";
import fetch from "node-fetch";

export const onCreateEvent = region("europe-west1")
  .runWith({ secrets: ["GITHUB_TOKEN"] })
  .firestore.document("events/{docId}")
  .onCreate(async (change) => {
    if (change.data().type !== "battleroyale:victory") return;

    const { GITHUB_REPOSITORY, GITHUB_TOKEN, GITHUB_WORKFLOW } = process.env;

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/workflows/${GITHUB_WORKFLOW}/dispatches`,
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
      logger.error(
        `Status ${response.url} on ${response.status}`,
        await response.json()
      );
      return false;
    }

    return true;
  });
