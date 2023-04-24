/* eslint-disable */
// @ts-nocheck
// See issue https://github.com/nextauthjs/next-auth/issues/6174
// import { SvelteGoogleAuthHook } from 'svelte-google-auth/server';
// import type { Handle } from '@sveltejs/kit';
import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/core/providers/github"
import { ARNOLDI_GITHUB_ID, ARNOLDI_GITHUB_SECRET } from "$env/static/private"

// Import client credentials from json file
// import client_secret from '../google_client_secret.json';
// const auth = new SvelteGoogleAuthHook(client_secret.web);

// export const handle = async ({ event, resolve }) => {
//   return SvelteKitAuth({
//     providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
//   });
//   // return await auth.handleAuth({ event, resolve });
// }

export const handle = SvelteKitAuth({
  providers: [GitHub({ clientId: ARNOLDI_GITHUB_ID, clientSecret: ARNOLDI_GITHUB_SECRET })],
});
