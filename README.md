# AltTextAPI

With "AltTextAPI" you can get the alt text of an image. Just call the API (https://alttextapi.com/v0/image-to-alt-text) with the image URL and you will get the alt text as a response.

```sh
curl -X GET -H "Content-Type: application/json" https://alttextapi.com/v0/image-to-alt-text?imageUrl=IMAGE_URL&contextPrompt=CONTEXT_PROMPT
```

Example:

<img src="https://firebasestorage.googleapis.com/v0/b/alt-text-api.appspot.com/o/alt-text-api-demo.png?alt=media&token=5b340e2a-d807-4da9-9ba2-25c772df3e30" width=200/>

```sh
curl -X GET -H "Content-Type: application/json" https://alttextapi.com/v0/image-to-alt-text?imageUrl=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Falt-text-api.appspot.com%2Fo%2Falt-text-api-demo.png%3Falt%3Dmedia%26token%3D5b340e2a-d807-4da9-9ba2-25c772df3e30
```

You can also try out the API at: https://alttextapi.com
