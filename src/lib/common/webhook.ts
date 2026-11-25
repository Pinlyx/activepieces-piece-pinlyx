import { HttpMethod } from '@activepieces/pieces-common';
import { isNil } from '@activepieces/pieces-framework';
import crypto from 'crypto';
import { pinlyxClient } from './client';
import { PinlyxStoredWebhook, PinlyxWebhookCreateResponse, PinlyxWebhookEnvelope } from './types';

const SIGNATURE_HEADER = 'x-webhook-signature';
const SIGNATURE_PREFIX = 'sha256=';

async function register({
	apiKey,
	webhookUrl,
	eventType,
	description,
}: {
	apiKey: string;
	webhookUrl: string;
	eventType: string;
	description: string;
}): Promise<PinlyxStoredWebhook> {
	const response = await pinlyxClient.apiCall<PinlyxWebhookCreateResponse>({
		apiKey,
		method: HttpMethod.POST,
		path: '/webhooks',
		body: { url: webhookUrl, eventTypes: [eventType], description },
	});
	return { webhookId: response.endpoint.id, secret: response.secret };
}

async function unregister({
	apiKey,
	stored,
}: {
	apiKey: string;
	stored: PinlyxStoredWebhook | null | undefined;
}): Promise<void> {
	if (isNil(stored)) {
		return;
	}
	await pinlyxClient.apiCall({
		apiKey,
		method: HttpMethod.DELETE,
		path: `/webhooks/${stored.webhookId}`,
		query: { hard: 'true' },
	});
}

function readVerifiedEvent<T>({
	stored,
	headers,
	rawBody,
	body,
	eventType,
}: {
	stored: PinlyxStoredWebhook | null | undefined;
	headers: Record<string, string>;
	rawBody: unknown;
	body: unknown;
	eventType: string;
}): T | null {
	if (isNil(stored) || !(typeof rawBody === 'string' || Buffer.isBuffer(rawBody))) {
		return null;
	}
	if (!isSignatureValid({ secret: stored.secret, header: headers[SIGNATURE_HEADER], rawBody })) {
		return null;
	}
	if (!isEnvelope<T>(body) || body.event !== eventType) {
		return null;
	}
	return body.data;
}

function isSignatureValid({
	secret,
	header,
	rawBody,
}: {
	secret: string;
	header: string | undefined;
	rawBody: string | Buffer;
}): boolean {
	if (isNil(header) || !header.startsWith(SIGNATURE_PREFIX)) {
		return false;
	}
	const received = Buffer.from(header.slice(SIGNATURE_PREFIX.length), 'hex');
	const expected = crypto.createHmac('sha256', secret).update(rawBody).digest();
	return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

function isEnvelope<T>(value: unknown): value is PinlyxWebhookEnvelope<T> {
	return (
		typeof value === 'object' &&
		value !== null &&
		'event' in value &&
		typeof value.event === 'string' &&
		'data' in value
	);
}

export const pinlyxWebhook = {
	register,
	unregister,
	readVerifiedEvent,
};
