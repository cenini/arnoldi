<script lang="ts">
  import { onMount, type SvelteComponent } from "svelte";
  import { goto } from '$app/navigation';

  onMount(() => {
    goto("/chat");
  });

</script>
