import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// getAltTextForImage function as promise
export function getAltTextForImage(file, contextPrompt) {
	return new Promise(async (resolve, reject) => {
		const imageByteArray = await getByteArrayOfImage(file);

		const downloadURL = await uploadToFirebase(imageByteArray, file.name);

		const altText = await getAltTextFromDownloadURL(downloadURL, contextPrompt);

		resolve(altText);
	});
}

async function getByteArrayOfImage(file) {
	// Get first element of files and read bytearray from it
	console.log('Got file: ', file);
	const reader = new FileReader();
	reader.readAsArrayBuffer(file);
	let byteArray = undefined;
	reader.onload = async function () {
		console.log('Load');
		byteArray = new Uint8Array(reader.result);
		console.log('Got byteArray of image: ', byteArray);
	};
	while (!reader.result) {
		await new Promise((resolve) => setTimeout(resolve, 10));
	}
	return byteArray;
}

async function uploadToFirebase(byteArray, filename) {
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

	const fileRef = ref(getStorage(app), filename);
	await uploadBytes(fileRef, byteArray).then((snapshot) => {
		console.log('Uploaded the image!', snapshot);
	});

	const downloadURL = await getDownloadURL(fileRef);
	console.log('downloadURL', downloadURL);
	return downloadURL;
}

async function getAltTextFromDownloadURL(downloadURL, contextPrompt) {
	const encodedUrl = encodeURI(downloadURL);
	const encodedContextPrompt = encodeURI(contextPrompt);

	const res = await fetch(
		`https://AltTextAPI.com/v0/image-to-alt-text?imageUrl=${encodedUrl}&contextPrompt=${encodedContextPrompt}`
	);
	const altText = await res.json();
	console.log('Fetched alt text: ', altText);
	return altText;
}
