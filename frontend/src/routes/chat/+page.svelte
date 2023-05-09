<script>
	import Chat from './chat.svelte';
	import Bottomnav from '../bottomnav/bottomnav.svelte';
</script>

<div class="flex h-screen bg-neutral-focus  ">
  <div class="w-full max-w-2xl m-auto bg-base-200 rounded-lg shadow-lg p-6 flex-col">
    <Chat />
    <Bottomnav />
  </div>
</div>
