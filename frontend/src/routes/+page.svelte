<script lang="ts">
  import Chat from "./chat/chat.svelte";
  import Bottomnav from "./bottomnav/bottomnav.svelte";
  import type { SvelteComponent } from "svelte";
  import { selectedView, views } from "./store";
  import type { SelectedView, AnySvelteComponent } from "./store";

  let currentView: AnySvelteComponent = Chat;
  selectedView.subscribe((value: SelectedView) => {
    currentView = views[value] as AnySvelteComponent;
  });
</script>

<div>
  <svelte:component this={currentView}></svelte:component>
  <Bottomnav />
</div>
