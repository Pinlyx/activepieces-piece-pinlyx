import { HttpMethod } from '@activepieces/pieces-common';
import { createTrigger, TriggerStrategy } from '@activepieces/pieces-framework';
import { pinlyxAuth } from '../auth';
import { pinlyxClient } from '../common/client';
import { pinlyxEventShapes } from '../common/event-shapes';
import { PinlyxContact, PinlyxPage, PinlyxStoredWebhook } from '../common/types';
import { pinlyxWebhook } from '../common/webhook';

const STORE_KEY = 'pinlyx_new_contact_webhook';
const EVENT_TYPE = 'contact.created';

export const newContactTrigger = createTrigger({
	auth: pinlyxAuth,
	name: 'new_contact',
	classification: 'READ',
	displayName: 'New Contact',
	description: 'Triggers when a contact is added to Pinlyx, from any channel, the app, the API or an import.',
	aiMetadata: {
		description:
			'Fires once for every contact created in the Pinlyx workspace, whether it came from an inbound message, the app, the public API, a CSV import or the browser extension. One payload is one contact.',
	},
	props: {},
	type: TriggerStrategy.WEBHOOK,
	sampleData: {
		id: 1842,
		externalId: null,
		name: 'Jane Doe',
		username: 'janedoe',
		email: 'jane@example.com',
		phone: '+905551234567',
		company: 'Acme',
		country: 'Turkey',
		city: 'Istanbul',
		platform: 'telegram',
		source: 'api',
		stage: 'lead',
		pipelineId: null,
		pipelineStageId: null,
		leadScore: null,
		assignedToUserId: null,
		createdAt: '2026-11-25T09:30:00Z',
		updatedAt: '2026-11-25T09:30:00Z',
		userId: 42,
		actorUserId: 42,
	},
	async onEnable(context) {
		const stored = await pinlyxWebhook.register({
			apiKey: context.auth.secret_text,
			webhookUrl: context.webhookUrl,
			eventType: EVENT_TYPE,
			description: 'Activepieces: New Contact',
		});
		await context.store.put<PinlyxStoredWebhook>(STORE_KEY, stored);
	},
	async onDisable(context) {
		const stored = await context.store.get<PinlyxStoredWebhook>(STORE_KEY);
		await pinlyxWebhook.unregister({ apiKey: context.auth.secret_text, stored });
		await context.store.delete(STORE_KEY);
	},
	async test(context) {
		const page = await pinlyxClient.apiCall<PinlyxPage<PinlyxContact>>({
			apiKey: context.auth.secret_text,
			method: HttpMethod.GET,
			path: '/contacts',
			query: { limit: 5 },
		});
		return page.items.map((contact) => pinlyxEventShapes.contactToEventData({ contact }));
	},
	async run(context) {
		const stored = await context.store.get<PinlyxStoredWebhook>(STORE_KEY);
		const data = pinlyxWebhook.readVerifiedEvent<Record<string, unknown>>({
			stored,
			headers: context.payload.headers,
			rawBody: context.payload.rawBody,
			body: context.payload.body,
			eventType: EVENT_TYPE,
		});
		return data === null ? [] : [data];
	},
});
