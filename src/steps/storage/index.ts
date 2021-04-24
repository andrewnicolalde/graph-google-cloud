import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { CloudStorageClient } from './client';
import { IntegrationConfig, IntegrationStepContext } from '../../types';
import { createCloudStorageBucketEntity } from './converters';
import {
  CLOUD_STORAGE_BUCKET_ENTITY_TYPE,
  STEP_CLOUD_STORAGE_BUCKETS,
  CLOUD_STORAGE_BUCKET_ENTITY_CLASS,
} from './constants';
import { storage_v1 } from 'googleapis';
import { isMemberPublic } from '../../utils/iam';
import { publishUnprocessedBucketsEvent } from '../../utils/events';

export * from './constants';

function isBucketPolicyPublicAccess(
  bucketPolicy: storage_v1.Schema$Policy,
): boolean {
  for (const binding of bucketPolicy.bindings || []) {
    for (const member of binding.members || []) {
      if (isMemberPublic(member)) {
        return true;
      }
    }
  }

  return false;
}

export async function fetchStorageBuckets(
  context: IntegrationStepContext,
): Promise<void> {
  const {
    jobState,
    instance: { config },
    logger,
  } = context;

  const client = new CloudStorageClient({ config });

  const unprocessedBucketsIds: string[] = [];
  await client.iterateCloudStorageBuckets(async (bucket) => {
    const bucketId = bucket.id as string;

    let bucketPolicy;
    try {
      bucketPolicy = await client.getPolicy(bucketId);
    } catch (err) {
      if (
        err.message ===
        'Bucket is requester pays bucket but no user project provided.'
      ) {
        unprocessedBucketsIds.push(bucketId);
        return;
      }
    }

    await jobState.addEntity(
      createCloudStorageBucketEntity({
        data: bucket,
        projectId: config.serviceAccountKeyConfig.project_id,
        isPublic: isBucketPolicyPublicAccess(bucketPolicy),
      }),
    );
  });

  publishUnprocessedBucketsEvent({
    logger,
    bucketIds: unprocessedBucketsIds.join(','),
  });
}

export const storageSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: STEP_CLOUD_STORAGE_BUCKETS,
    name: 'Cloud Storage Buckets',
    entities: [
      {
        resourceName: 'Cloud Storage Bucket',
        _type: CLOUD_STORAGE_BUCKET_ENTITY_TYPE,
        _class: CLOUD_STORAGE_BUCKET_ENTITY_CLASS,
      },
    ],
    relationships: [],
    executionHandler: fetchStorageBuckets,
  },
];
