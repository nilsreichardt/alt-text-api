<script>
	import { writeFile } from 'fs/promises';
	let uploadPath;

	$: if (uploadPath) {
		console.log(uploadPath);
		const file = data.get('file');
		const result = await file;
		console.log('Read the file:', result);
		const readFile = new Uint8Array(await file.arrayBuffer());
		console.log('Read the file:', result);
	}
</script>

<h1>Welcome to SvelteKit</h1>

<input type="file" accept="image/png, image/jpeg" bind:value={uploadPath} />

<style>
	input {
		width: 100px;
		height: 50px;
	}
</style>
