import { HttpMethod } from '@activepieces/pieces-common';
import { createAction, Property } from '@activepieces/pieces-framework';
import { pinlyxAuth } from '../auth';
import { pinlyxClient } from '../common/client';
import { pinlyxProps } from '../common/props';

export const createContactAction = createAction({
	auth: pinlyxAuth,
	name: 'create_contact',
	classification: 'WRITE',
	displayName: 'Create Contact',
	description: 'Adds a new contact to your Pinlyx CRM.',
	audience: 'both',
	aiMetadata: {
		description:
			'Create one contact in the Pinlyx CRM. Provide at least one of name, username, phone, email or external ID. Fails with a conflict if the external ID already exists, and each call creates a new contact, so retries duplicate.',
		idempotent: false,
	},
	props: {
		name: Property.ShortText({
			displayName: 'Name',
			description: 'Full name, for example "Jane Doe". Up to 100 characters.',
			required: false,
		}),
		email: Property.ShortText({
			displayName: 'Email',
			description: 'Email address, for example "jane@example.com".',
			required: false,
		}),
		phone: Property.ShortText({
			displayName: 'Phone',
			description: 'Phone number with country code, for example "+905551234567". Up to 20 characters.',
			required: false,
		}),
		username: Property.ShortText({
			displayName: 'Username',
			description: 'Telegram or X username, with or without the leading @.',
			required: false,
		}),
		company: Property.ShortText({
			displayName: 'Company',
			required: false,
		}),
		externalId: Property.ShortText({
			displayName: 'External ID',
			description:
				'The contact ID in your own system. It must be unique in your workspace; creating a second contact with the same value fails.',
			required: false,
		}),
		country: Property.ShortText({
			displayName: 'Country',
			required: false,
		}),
		city: Property.ShortText({
			displayName: 'City',
			required: false,
		}),
		notes: Property.LongText({
			displayName: 'Notes',
			description: 'Free text notes. Up to 500 characters.',
			required: false,
		}),
		stage: Property.StaticDropdown({
			displayName: 'Stage',
			description: 'Where the contact starts in your pipeline.',
			required: false,
			options: { options: pinlyxProps.contactStageOptions },
		}),
		leadScore: Property.Number({
			displayName: 'Lead Score',
			description: 'A whole number from 0 to 100.',
			required: false,
		}),
		tags: Property.Array({
			displayName: 'Tags',
			description: 'Tag names to attach. Tags that do not exist yet are created.',
			required: false,
		}),
		customFields: Property.Object({
			displayName: 'Custom Fields',
			description:
				'Values for your custom contact fields, keyed by field key, for example plan = "pro".',
			required: false,
		}),
	},
	async run(context) {
		const {
			name,
			email,
			phone,
			username,
			company,
			externalId,
			country,
			city,
			notes,
			stage,
			leadScore,
			tags,
			customFields,
		} = context.propsValue;
		return await pinlyxClient.apiCall({
			apiKey: context.auth.secret_text,
			method: HttpMethod.POST,
			path: '/contacts',
			body: pinlyxClient.compactBody({
				fields: {
					name,
					email,
					phone,
					username,
					company,
					externalId,
					country,
					city,
					notes,
					stage,
					leadScore,
					tags,
					customFields: Object.keys(customFields ?? {}).length > 0 ? customFields : undefined,
				},
			}),
		});
	},
});
