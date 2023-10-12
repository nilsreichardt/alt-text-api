<script>
	import { initializeApp } from 'firebase/app';
	import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	let files;
	let contextField = '';

	async function uploadImage() {
		console.log(files);
		// const file = data.get('file');
		// const result = await file;
		// console.log('Read the file:', result);
		// const readFile = new Uint8Array(await file.arrayBuffer());
		// console.log('Read the file:', readFile);

		// Get first element of files and read bytearray from it
		const file = files[0];
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);
		reader.onload = async function () {
			console.log('Load');
			const byteArray = new Uint8Array(reader.result);
			console.log(byteArray);
			await uploadToServer(byteArray);
			// send byteArray to server for processing
		};
	}

	async function uploadToServer(byteArray) {
		// Import the functions you need from the SDKs you need

		// Your web app's Firebase configuration
		const firebaseConfig = {
			apiKey: 'AIzaSyC4Zkr_lET3rMgxJFMMpuCyiKe8JvPv7t8',
			authDomain: 'alt-text-api.firebaseapp.com',
			projectId: 'alt-text-api',
			storageBucket: 'alt-text-api.appspot.com',
			messagingSenderId: '808369449824',
			appId: '1:808369449824:web:2a306c4dd57f029dadcc05'
		};

		// Initialize Firebase
		const app = initializeApp(firebaseConfig);

		const fileRef = ref(getStorage(app), 'images/' + files[0].name);
		await uploadBytes(fileRef, byteArray).then((snapshot) => {
			console.log('Uploaded a blob or file!', snapshot);
		});

		const downloadURL = await getDownloadURL(fileRef);
		console.log('downloadURL', downloadURL);
		const encodedUrl = encodeURI(downloadURL);

		const res = await fetch(
			`https://AltTextAPI.com/v0/image-to-alt-text?imageUrl=${encodedUrl}&contextPrompt=${encodeURI(
				contextField
			)}`
		);
		console.log('result', await res.json());
	}
</script>

<h1>Welcome to SvelteKit</h1>

<textarea rows="4" cols="50" placeholder="Enter the context here" bind:value={contextField} />

<input type="file" bind:files accept="image/png, image/jpeg" on:change={uploadImage} />

<style>
	input {
		width: 100px;
		height: 50px;
	}
</style>
