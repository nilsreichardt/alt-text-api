import * as vision from '@google-cloud/vision';
import { RemoteSafeSearchRepository } from './vision';
import { GptRepository } from './gpt_repository';

const express = require('express');
const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get('/v0/image-to-alt-text', async (req, res) => {
  // Set cors to *
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');

  try {
    const imageUrl = req.query.imageUrl;
    const annotations = await getImageAnnotations(imageUrl);
    const altText = await requestAltTextFromGpt(annotations);

    res.status(200).send({
      'alt-text': altText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: error,
    });
  }
});

async function getImageAnnotations(imageUrl: string): Promise<string> {
  const repository = new RemoteSafeSearchRepository(
    new vision.ImageAnnotatorClient()
  );

  console.log(`Requesting image annotations for: ${imageUrl}`);
  const result = await repository.requestImage(imageUrl);

  console.log('Received annotations.');
  return JSON.stringify(result, null, 2);
}

async function requestAltTextFromGpt(annotationsJson: string): Promise<string> {
  const prompt = `${annotationsJson}\n\nThis is the response of Google Cloud Vision AI API. Please take this JSON response and write an alternative text for this image. This sentence should describe the image for blind people and should 2-3 sentences. Please write your answer in German.`;

  const gptRepository = new GptRepository();
  const response = await gptRepository.askGpt({
    prompt: prompt,
  });

  console.log('Received GPT response.');
  console.log(response.message);

  return response.message;
}

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
