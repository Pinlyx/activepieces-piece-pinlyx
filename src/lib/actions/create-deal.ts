import { HttpMethod } from '@activepieces/pieces-common';
import { createAction, Property } from '@activepieces/pieces-framework';
import { pinlyxAuth } from '../auth';
import { pinlyxClient } from '../common/client';
import { pinlyxProps } from '../common/props';

export const createDealAction = createAction({
	auth: pinlyxAuth,
	name: 'create_deal',
	classification: 'WRITE',
	displayName: 'Create Deal',
	description: 'Adds a new deal to your Pinlyx sales pipeline.',
	audience: 'both',
	aiMetadata: {
		description:
			'Create a deal in the Pinlyx sales pipeline, optionally linked to a contact. Deals cannot be created as won or lost. Each call creates a new deal, so retries duplicate.',
		idempotent: false,
	},
	props: {
		title: Property.ShortText({
			displayName: 'Title',
			description: 'Deal title, for example "Website redesign for Acme".',
			required: true,
		}),
		contactId: Property.Number({
			displayName: 'Contact ID',
			description:
				'Links the deal to a contact. Map it from a previous step such as Create Contact or Search Contacts.',
			required: false,
		}),
		value: Property.Number({
			displayName: 'Value',
			description: 'The deal amount, for example 2500.',
			required: false,
		}),
		currency: Property.ShortText({
			displayName: 'Currency',
			description: 'Three letter currency code, for example "USD" or "TRY". Defaults to USD.',
			required: false,
		}),
		stage: Property.StaticDropdown({
			displayName: 'Stage',
			description: 'Defaults to Lead.',
			required: false,
			options: { options: pinlyxProps.dealStageOptions },
		}),
		probability: Property.Number({
			displayName: 'Probability',
			description: 'Chance of winning as a percentage from 0 to 100.',
			required: false,
		}),
		expectedCloseAt: Property.DateTime({
			displayName: 'Expected Close Date',
			required: false,
		}),
		notes: Property.LongText({
			displayName: 'Notes',
			required: false,
		}),
	},
	async run(context) {
		const { title, contactId, value, currency, stage, probability, expectedCloseAt, notes } =
			context.propsValue;
		return await pinlyxClient.apiCall({
			apiKey: context.auth.secret_text,
			method: HttpMethod.POST,
			path: '/deals',
			body: pinlyxClient.compactBody({
				fields: {
					title,
					contactId,
					value,
					currency,
					stage,
					probability,
					expectedCloseAt: pinlyxClient.toIsoDate({ value: expectedCloseAt }),
					notes,
				},
			}),
		});
	},
});
