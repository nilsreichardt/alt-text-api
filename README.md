# AltTextAPI

With "AltTextAPI" you can get the alt text of an image. Just call the API (https://alttextapi.com/v0/image-to-alt-text) with the image URL and you will get the alt text as a response.

```sh
curl -X GET -H "Content-Type: application/json" https://alttextapi.com/v0/image-to-alt-text?imageUrl=IMAGE_URL&contextPrompt=CONTEXT_PROMPT
```

Example:

```sh
curl -X GET -H "Content-Type: application/json" https://alttextapi.com/v0/image-to-alt-text?imageUrl=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Falt-text-api.appspot.com%2Fo%2FWhatsApp.png%3Falt=media%26token=2e538e1f-5542-4879-bffd-7f0bc4bb8703
```

You can also try out the API at: https://alttextapi.com
