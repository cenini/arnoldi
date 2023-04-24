/* eslint-disable */
// @ts-nocheck
// See issue https://github.com/nextauthjs/next-auth/issues/6174
// import { SvelteGoogleAuthHook } from 'svelte-google-auth/server';
// import type { Handle } from '@sveltejs/kit';
import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/core/providers/github"
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private"

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
  trustHost: true,
  providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
  callbacks: {
    async signIn(user, account, profile) {
      return true;
    },
    async redirect(url, baseUrl) {
      return baseUrl;
    },
    async session(session, user) {
      return session;
    },
    async jwt(token, user, account, profile, isNewUser) {
      return token;
    },
  },
});

