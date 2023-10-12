<script>
	import { getAltTextForImage } from '$lib/uploader';
	import LoadingSpinner from './LoadingSpinner.svelte';
	let files;
	let contextPrompt = '';
	let promise;

	async function upload() {
		promise = getAltTextForImage(files[0], contextPrompt);
	}
</script>

<h1>Get alt text from image with context</h1>

{#if promise}
	<!-- Waiting and Result View -->
	{#await promise}
		<!-- promise is pending -->
		<p>Waiting for the alt text to be generated...</p>
		<LoadingSpinner />
	{:then value}
		<!-- promise was fulfilled -->
		<p>{value['alt-text']}</p>
		<button on:click={() => (promise = undefined)}>Generate a new one</button>
	{:catch error}
		<!-- promise was rejected -->
		<h2>An error occured!</h2>
		<p style="color: red">{error.message}</p>
		<button
			on:click={() => {
				promise = undefined;
				contextPrompt = '';
			}}
		>
			Generate a new one</button
		>
	{/await}
{:else}
	<!-- Selection View -->
	<textarea rows="4" cols="50" placeholder="Enter the context here" bind:value={contextPrompt} />

	<input type="file" bind:files accept="image/png, image/jpeg" on:change={upload} />
{/if}

<style>
	input {
		width: 100px;
		height: 50px;
	}

	textarea {
		border-radius: 10px;
		padding: 0.4rem;
	}

	button {
		border-radius: 10px;
		padding: 0.4rem;
		margin-top: 1rem;
	}
</style>
