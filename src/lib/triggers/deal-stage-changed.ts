import { HttpMethod } from '@activepieces/pieces-common';
import { createTrigger, Property, TriggerStrategy } from '@activepieces/pieces-framework';
import { pinlyxAuth } from '../auth';
import { pinlyxClient } from '../common/client';
import { pinlyxEventShapes } from '../common/event-shapes';
import { pinlyxProps } from '../common/props';
import { PinlyxDeal, PinlyxPage, PinlyxStoredWebhook } from '../common/types';
import { pinlyxWebhook } from '../common/webhook';

const STORE_KEY = 'pinlyx_deal_stage_changed_webhook';
const EVENT_TYPE = 'deal.stage_changed';
const ANY_STAGE = 'any';

type DealStageChangedData = {
	toStage?: string;
};

export const dealStageChangedTrigger = createTrigger({
	auth: pinlyxAuth,
	name: 'deal_stage_changed',
	classification: 'READ',
	displayName: 'Deal Stage Changed',
	description: 'Triggers when a deal moves to another stage of the sales pipeline.',
	aiMetadata: {
		description:
			'Fires each time a Pinlyx deal moves from one pipeline stage to another, including moves to won or lost, optionally only when it reaches one chosen stage. One payload is one move and carries the previous and the new stage.',
	},
	props: {
		toStage: Property.StaticDropdown({
			displayName: 'Only When Moved To',
			description: 'Run the flow only when the deal reaches this stage. Leave on Any stage to run on every move.',
			required: false,
			defaultValue: ANY_STAGE,
			options: {
				options: [
					{ label: 'Any stage', value: ANY_STAGE },
					...pinlyxProps.dealStageOptions,
					{ label: 'Won', value: 'won' },
					{ label: 'Lost', value: 'lost' },
				],
			},
		}),
	},
	type: TriggerStrategy.WEBHOOK,
	sampleData: {
		id: 311,
		userId: 42,
		actorUserId: 42,
		title: 'Website redesign for Acme',
		contactId: 1842,
		value: 2500,
		currency: 'USD',
		fromStage: 'proposal',
		toStage: 'negotiation',
		probability: 60,
		closedAt: null,
		origin: 'api',
		changedAt: '2026-11-25T09:45:00Z',
	},
	async onEnable(context) {
		const stored = await pinlyxWebhook.register({
			apiKey: context.auth.secret_text,
			webhookUrl: context.webhookUrl,
			eventType: EVENT_TYPE,
			description: 'Activepieces: Deal Stage Changed',
		});
		await context.store.put<PinlyxStoredWebhook>(STORE_KEY, stored);
	},
	async onDisable(context) {
		const stored = await context.store.get<PinlyxStoredWebhook>(STORE_KEY);
		await pinlyxWebhook.unregister({ apiKey: context.auth.secret_text, stored });
		await context.store.delete(STORE_KEY);
	},
	async test(context) {
		const page = await pinlyxClient.apiCall<PinlyxPage<PinlyxDeal>>({
			apiKey: context.auth.secret_text,
			method: HttpMethod.GET,
			path: '/deals',
			query: { limit: 5 },
		});
		return page.items.map((deal) => pinlyxEventShapes.dealToStageChangeEventData({ deal }));
	},
	async run(context) {
		const stored = await context.store.get<PinlyxStoredWebhook>(STORE_KEY);
		const data = pinlyxWebhook.readVerifiedEvent<DealStageChangedData>({
			stored,
			headers: context.payload.headers,
			rawBody: context.payload.rawBody,
			body: context.payload.body,
			eventType: EVENT_TYPE,
		});
		if (data === null) {
			return [];
		}
		const wanted = context.propsValue.toStage ?? ANY_STAGE;
		return wanted === ANY_STAGE || data.toStage === wanted ? [data] : [];
	},
});
