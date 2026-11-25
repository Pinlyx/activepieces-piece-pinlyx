import { HttpMethod } from '@activepieces/pieces-common';
import { createAction, Property } from '@activepieces/pieces-framework';
import { pinlyxAuth } from '../auth';
import { pinlyxClient } from '../common/client';
import { pinlyxProps } from '../common/props';

export const updateContactAction = createAction({
	auth: pinlyxAuth,
	name: 'update_contact',
	classification: 'WRITE',
	displayName: 'Update Contact',
	description: 'Changes fields on an existing contact. Fields you leave empty are not changed.',
	audience: 'both',
	aiMetadata: {
		description:
			'Update fields on an existing Pinlyx contact by ID; only the fields provided are changed and empty fields are skipped. Use Add Tag to Contact to change tags. Safe to retry.',
		idempotent: true,
	},
	props: {
		contactId: pinlyxProps.contactIdProp({}),
		name: Property.ShortText({
			displayName: 'Name',
			required: false,
		}),
		email: Property.ShortText({
			displayName: 'Email',
			required: false,
		}),
		phone: Property.ShortText({
			displayName: 'Phone',
			description: 'Phone number with country code, for example "+905551234567".',
			required: false,
		}),
		username: Property.ShortText({
			displayName: 'Username',
			required: false,
		}),
		company: Property.ShortText({
			displayName: 'Company',
			required: false,
		}),
		externalId: Property.ShortText({
			displayName: 'External ID',
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
			description: 'Replaces the existing notes. Up to 500 characters.',
			required: false,
		}),
		stage: Property.StaticDropdown({
			displayName: 'Stage',
			required: false,
			options: { options: pinlyxProps.contactStageOptions },
		}),
		leadScore: Property.Number({
			displayName: 'Lead Score',
			description: 'A whole number from 0 to 100.',
			required: false,
		}),
		customFields: Property.Object({
			displayName: 'Custom Fields',
			description:
				'Values to merge into the contact custom fields, keyed by field key. Existing keys you do not list stay as they are.',
			required: false,
		}),
	},
	async run(context) {
		const {
			contactId,
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
			customFields,
		} = context.propsValue;
		return await pinlyxClient.apiCall({
			apiKey: context.auth.secret_text,
			method: HttpMethod.PATCH,
			path: `/contacts/${contactId}`,
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
					customFields: Object.keys(customFields ?? {}).length > 0 ? customFields : undefined,
				},
			}),
		});
	},
});
