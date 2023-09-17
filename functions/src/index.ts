import { logger } from "firebase-functions/v2";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { Agent } from "https";
import fetch from "node-fetch";

type Type =
  | "basketball:victory"
  | "battleroyale:poop"
  | "battleroyale:victory"
  | "duel:victory"
  | "garticshow:victory";

const TRIGGERING_EVENTS: string[] = [
  "basketball:victory",
  "battleroyale:poop",
  "battleroyale:victory",
  "duel:victory",
  "garticshow:victory",
] satisfies Type[];

interface Event {
  type: Type;
}
const isEvent = (data: unknown): data is Event => {
  if (!data) return false;
  if (typeof data !== "object") return false;
  if (!("type" in data)) return false;
  const type = data["type"];
  if (typeof type !== "string") return false;
  return TRIGGERING_EVENTS.includes(type);
};

const agent = new Agent({ keepAlive: true });

export const onEventCreated = onDocumentCreated(
  {
    document: "events/{docId}",
    region: "europe-west1",
    secrets: ["GITHUB_REPOSITORY", "GITHUB_TOKEN", "GITHUB_WORKFLOW"],
  },
  async (event) => {
    const { GITHUB_REPOSITORY, GITHUB_TOKEN, GITHUB_WORKFLOW } = process.env;

    if (!isEvent(event.data?.data())) {
      return;
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/workflows/${GITHUB_WORKFLOW}/dispatches`,
      {
        agent,
        body: JSON.stringify({ ref: "main" }),
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
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
  }
);
