<script>

	import Chat from "./chat/chat.svelte";

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
</div>
