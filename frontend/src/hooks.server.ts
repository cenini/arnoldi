/* eslint-disable */
// @ts-nocheck
// See issue https://github.com/nextauthjs/next-auth/issues/6174
// import { SvelteGoogleAuthHook } from 'svelte-google-auth/server';
// import type { Handle } from '@sveltejs/kit';
import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/core/providers/github"
import { VITE_GITHUB_ID, GITHUB_SECRET, AUTH_SECRET } from "$env/static/private"

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
  // trustHost: true,
  providers: [GitHub({ clientId: VITE_GITHUB_ID, clientSecret: GITHUB_SECRET })],
  secret: AUTH_SECRET,
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
  // callbacks: {
  //   async redirect(params: { url: string }) {
  //     const { url } = params

  //     // url is just a path, e.g.: /videos/pets
  //     if (!url.startsWith('http')) return url

  //     // If we have a callback use only its relative path
  //     const callbackUrl = new URL(url).searchParams.get('callbackUrl')
  //     if (!callbackUrl) return url

  //     return new URL(callbackUrl as string).pathname
  //   },
  // }
});

