<script>
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	const clientId = import.meta.env.VITE_GITHUB_ID;
</script>

<style>
	.github-login-container {
			display: flex;
			align-items: center;
			font-family: Arial, sans-serif;
	}
	.avatar {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
			margin-right: 10px;
	}
	.signedInText {
			margin-right: 10px;
	}
	.signedInText strong {
			display: block;
	}
	.github-login-button {
			display: flex;
			align-items: center;
			background-color: #24292e;
			color: white;
			padding: 5px 10px;
			border-radius: 4px;
			border: none;
			cursor: pointer;
			font-size: 14px;
	}
	.github-login-button img {
			width: 20px;
			margin-right: 5px;
	}
</style>

<div class="github-login-container">
	{#if Object.keys($page.data.session || {}).length}
			{#if $page.data.session?.user?.image}
					<span style="background-image: url('{$page.data.session.user.image}')" class="avatar" />
			{/if}
			<span class="signedInText">
					<small>Signed in as</small><br />
					<strong>{$page.data.session?.user?.email || $page.data.session?.user?.name}</strong>
			</span>
			<button on:click={() => signOut()} class="button">Sign out</button>
	{:else}
			<button on:click={() => signIn('github', {clientId: clientId})} class="github-login-button">
					<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Icon" />
					Sign In with GitHub
			</button>
	{/if}
</div>
