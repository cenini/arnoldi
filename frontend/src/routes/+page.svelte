<script>

	import Chat from "./chat/chat.svelte";
  import Auth from "./auth/google.svelte";
	import Github from "./auth/github.svelte";
	import Google from "./auth/google.svelte";
	import Bottomnav from "./bottomnav/bottomnav.svelte";

</script>

<style lang="postcss">
  /* :global(html) {
    background-color: theme(colors.gray.100);
  } */
  .chat-container {
    height: 100vh;
  }
</style>

<div class="chat-container">
  <Chat />
  <Github />
  <Bottomnav />
  <!-- <Google /> -->
</div>
