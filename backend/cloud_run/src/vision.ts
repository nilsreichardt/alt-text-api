import * as vision from '@google-cloud/vision';

export abstract class VisionRepository {
  abstract requestImage(downloadUrl: string): Promise<any>;
}

export type SafeSearchClassification =
  | 'UNKNOWN'
  | 'VERY_UNLIKELY'
  | 'UNLIKELY'
  | 'LIKELY'
  | 'VERY_LIKELY'
  | 'POSSIBLE';

/**
 * How to authenticate the client? There are serval ways. We just export the
 * service account credentials to the environment variables, because cloud
 * functions working with the same way.
 */
export class RemoteSafeSearchRepository extends VisionRepository {
  constructor(private vision: vision.ImageAnnotatorClient) {
    super();
  }

  async requestImage(downloadUrl: string): Promise<any> {
    const result = await this.vision.annotateImage({
      image: { source: { imageUri: downloadUrl } },
      features: [
        {
          maxResults: 50,
          type: 'LANDMARK_DETECTION',
        },
        {
          maxResults: 50,
          type: 'FACE_DETECTION',
        },
        {
          maxResults: 50,
          type: 'OBJECT_LOCALIZATION',
        },
        {
          maxResults: 50,
          type: 'LOGO_DETECTION',
        },
        {
          maxResults: 50,
          type: 'LABEL_DETECTION',
        },
        {
          maxResults: 50,
          model: 'builtin/latest',
          type: 'DOCUMENT_TEXT_DETECTION',
        },
        {
          maxResults: 50,
          type: 'SAFE_SEARCH_DETECTION',
        },
        {
          maxResults: 50,
          type: 'IMAGE_PROPERTIES',
        },
        {
          maxResults: 50,
          type: 'CROP_HINTS',
        },
      ],
    });
    return result[0];
  }
}
