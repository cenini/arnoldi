<!-- <script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { signIn, signOut, initialize } from 'svelte-google-auth/client';
	import { PageData } from '../$types';

	export let data: PageData;
	initialize(data, invalidateAll);
</script>

{data.auth.user?.name}
<button on:click={() => signIn()}>Sign In</button>
<button on:click={() => signOut()}>Sign Out</button> -->