import { building } from "$app/environment";
import type { Handle } from "@sveltejs/kit";
import { minify } from "@swc/html";

const OPTIONS = {
  collapseWhitespaces: "smart" as const,
  quotes: true,
  tagOmission: false,
};

// eslint-disable-next-line @typescript-eslint/unbound-method
export const handle: Handle = async ({ event, resolve }) => {
  let page = "";

  return resolve(event, {
    transformPageChunk: async ({ html, done }) => {
      page += html;
      if (done) {
        return building
          ? await minify(page, OPTIONS).then(({ code }) => code)
          : page;
      }
      return undefined;
    },
  });
};
