import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import Chat from "./chat/chat.svelte";
import Settings from "./settings/settings.svelte";

interface ViewComponents {
  chat: typeof Chat;
  settings: typeof Settings;
}

export const views: ViewComponents = {
  chat: Chat,
  settings: Settings,
};

export type SelectedView = keyof ViewComponents;

export type AnySvelteComponent = new (...args: any[]) => any;

export const selectedView: Writable<SelectedView> = writable<SelectedView>("chat");
