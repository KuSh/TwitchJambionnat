import { dev } from "$app/environment";

// No need for any JS on this site, but we'll load it in dev for HMR
export const csr = dev;
export const prerender = true;
export const trailingSlash = "always";
