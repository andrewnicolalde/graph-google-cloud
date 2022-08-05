import { IntegrationConfig } from '../types';
import { google } from 'googleapis';
import { CredentialBody, BaseExternalAccountClient } from 'google-auth-library';
import { GaxiosResponse } from 'gaxios';
import {
  IntegrationProviderAuthorizationError,
  IntegrationProviderAPIError,
  IntegrationError,
} from '@jupiterone/integration-sdk-core';
import { createErrorProps } from './utils/createErrorProps';
import { retry } from '@lifeomic/attempt';
// import { GoogleCloudServiceApiDisabledError } from './errors';

export interface ClientOptions {
  config: IntegrationConfig;
  /**
   * Specific project ID to target. The order of overrides is the following:
   *
   * ClientOptions.projectId ||
   * config.projectId ||
   * config.serviceAccountKeyConfig.project_id
   */
  projectId?: string;
  organizationId?: string;
  onRetry?: (err: any) => void;
}

export interface PageableResponse {
  nextPageToken?: string;
}

export type PageableGaxiosResponse<T> = GaxiosResponse<
  T & {
    nextPageToken?: string | null | undefined;
  }
>;

export type IterateApiOptions = {
  onRetry?: (err: any) => void;
};

export async function iterateApi<T>(
  fn: (nextPageToken?: string) => Promise<PageableGaxiosResponse<T>>,
  callback: (data: T) => Promise<void>,
  options?: IterateApiOptions,
) {
  let nextPageToken: string | undefined;

  do {
    const wrappedFn = withErrorHandling(fn, options);
    const result = await wrappedFn(nextPageToken);
    nextPageToken = result.data.nextPageToken || undefined;
    await callback(result.data);
  } while (nextPageToken);
}

export class Client {
  readonly projectId: string;
  readonly organizationId?: string;
  readonly folderId?: string;

  private credentials: CredentialBody;
  private auth: BaseExternalAccountClient;
  private readonly onRetry?: (err: any) => void;

  constructor({ config, projectId, organizationId, onRetry }: ClientOptions) {
    this.projectId =
      projectId ||
      config.projectId ||
      config.serviceAccountKeyConfig.project_id;
    this.organizationId = organizationId || config.organizationId;
    //this.credentials = {
    //  client_email: config.serviceAccountKeyConfig.client_email,
    //  private_key: config.serviceAccountKeyConfig.private_key,
    //};
    this.folderId = config.folderId;
    this.onRetry = onRetry;
  }

  private async getClient(): Promise<BaseExternalAccountClient> {
    const auth = new google.auth.GoogleAuth({
      credentials: this.credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = (await auth.getClient()) as BaseExternalAccountClient;
    await client.getAccessToken();
    return client;
  }

  async getAuthenticatedServiceClient(): Promise<BaseExternalAccountClient> {
    if (!this.auth) {
      this.auth = await this.getClient();
    }

    return this.auth;
  }

  async iterateApi<T>(
    fn: (nextPageToken?: string) => Promise<PageableGaxiosResponse<T>>,
    callback: (data: T) => Promise<void>,
  ) {
    return iterateApi(fn, callback, {
      onRetry: this.onRetry,
    });
  }
}

export type WithErrorHandlingOptions = {
  onRetry?: (err: any) => void;
};

export function withErrorHandling<T extends (...params: any) => any>(
  fn: T,
  options?: WithErrorHandlingOptions,
) {
  return async (...params: any) => {
    return retry(
      async () => {
        return await fn(...params);
      },
      {
        delay: 2_000,
        timeout: 91_000, // Need to set a timeout, otherwise we might wait for a response indefinitely.
        maxAttempts: 6,
        factor: 2.25, //t=0s, 2s, 4.5s, 10.125s, 22.78125s, 51.2578125 (90.6640652s)
        handleError(err, ctx) {
          const newError = handleApiClientError(err);

          if (!newError.retryable) {
            ctx.abort();
            throw newError;
          } else if (options?.onRetry) {
            options.onRetry(err);
          }
        },
      },
    );
  };
}

/**
 * Codes unknown error into JupiterOne errors
 */
function handleApiClientError(error: any) {
  // If the error was already handled, forward it on
  if (error instanceof IntegrationError) {
    return error;
  }

  let err;
  const errorProps = createErrorProps(error);
  const code = error.response?.status;

  // Per these two sets of docs, and depending on the api, gcloud
  // will return a 403 or 429 error to signify rate limiting:
  // https://cloud.google.com/compute/docs/api-rate-limits
  // https://cloud.google.com/resource-manager/docs/core_errors
  if (code == 403) {
    err = new IntegrationProviderAuthorizationError(errorProps);

    if (
      error.message?.match &&
      // GCP responds with a 403 when an API quota has been exceeded. We should
      // retry this case.
      error.message.match(/Quota exceeded/i)
    ) {
      (err as any).retryable = true;
    }
  } else if (
    code == 400 &&
    error.message?.match &&
    error.message.match(/billing/i)
  ) {
    err = new IntegrationProviderAuthorizationError(errorProps);
  } else if (code === 429 || code >= 500) {
    err = new IntegrationProviderAPIError(errorProps);
    (err as any).retryable = true;
  } else {
    err = new IntegrationProviderAPIError(errorProps);
  }

  if (shouldKeepErrorMessage(error)) {
    err.message = error.message;
  }

  return err;
}

function shouldKeepErrorMessage(error: any) {
  const errorMessagesToKeep = [
    'billing is disabled',
    'requires billing to be enabled',
    'it is disabled',
    'is not a workspace',
    // Example: Cloud Text-to-Speech API has not been used in project 123456789 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/texttospeech.googleapis.com/overview?project=123456789 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.
    'If you enabled this API recently',
  ];
  return (
    error?.message?.match &&
    error.message.match(createRegex(errorMessagesToKeep))
  );
}

function createRegex(regexes: string[]) {
  return new RegExp(regexes.map((regex) => '(' + regex + ')').join('|'), 'i');
}
