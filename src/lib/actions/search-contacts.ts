import { createAction, Property } from '@activepieces/pieces-framework';
import { pinlyxAuth } from '../auth';
import { pinlyxClient } from '../common/client';
import { PinlyxContact } from '../common/types';

const DEFAULT_MAX_RESULTS = 25;
const MAX_RESULTS_LIMIT = 500;

export const searchContactsAction = createAction({
	auth: pinlyxAuth,
	name: 'search_contacts',
	classification: 'SEARCH',
	displayName: 'Search Contacts',
	description: 'Finds contacts by text, exact email or external ID.',
	audience: 'both',
	aiMetadata: {
		description:
			'Search Pinlyx contacts. Free text matches name, username, phone, email, company and external ID; email and external ID filters are exact. Returns a list that can be empty. Read only and safe to retry.',
		idempotent: true,
	},
	props: {
		query: Property.ShortText({
			displayName: 'Search Text',
			description:
				'Matches part of a name, username, phone, email, company or external ID, for example "acme".',
			required: false,
		}),
		email: Property.ShortText({
			displayName: 'Exact Email',
			description: 'Only contacts with exactly this email address, for example "jane@example.com".',
			required: false,
		}),
		externalId: Property.ShortText({
			displayName: 'External ID',
			description: 'Only the contact with exactly this ID from your own system.',
			required: false,
		}),
		updatedSince: Property.DateTime({
			displayName: 'Updated Since',
			description: 'Only contacts created or changed at or after this time.',
			required: false,
		}),
		maxResults: Property.Number({
			displayName: 'Max Results',
			description: `How many contacts to return, up to ${MAX_RESULTS_LIMIT}. Defaults to ${DEFAULT_MAX_RESULTS}.`,
			required: false,
			defaultValue: DEFAULT_MAX_RESULTS,
		}),
	},
	async run(context) {
		const { query, email, externalId, updatedSince, maxResults } = context.propsValue;
		const requested = Math.floor(maxResults ?? DEFAULT_MAX_RESULTS);
		return await pinlyxClient.listItems<PinlyxContact>({
			apiKey: context.auth.secret_text,
			path: '/contacts',
			query: {
				q: query,
				email,
				externalId,
				updatedSince: pinlyxClient.toIsoDate({ value: updatedSince }),
			},
			maxItems: Math.min(Math.max(requested, 1), MAX_RESULTS_LIMIT),
		});
	},
});
