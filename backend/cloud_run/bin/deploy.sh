#!/bin/sh

PROJECT=alt-text-api
IMAGE=gcr.io/${PROJECT}/alt-text-api

env_vars="ENV=production,"
env_vars="${env_vars}VERSION=${VERSION},"

gcloud builds submit --tag $IMAGE --project=$PROJECT --gcs-log-dir=gs://${PROJECT}_cloudbuild/logs &&
  gcloud run deploy alt-text-api \
    --image $IMAGE \
    --set-env-vars="$env_vars" \
    --project=$PROJECT \
    --platform managed \
    --allow-unauthenticated \
    --region=europe-west1 \
    --service-account="cloud-run@alt-text-api.iam.gserviceaccount.com"
