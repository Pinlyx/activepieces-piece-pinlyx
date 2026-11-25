import { HttpMethod } from '@activepieces/pieces-common';
import { createAction, Property } from '@activepieces/pieces-framework';
import { pinlyxAuth } from '../auth';
import { pinlyxClient } from '../common/client';
import { pinlyxProps } from '../common/props';

export const addTagToContactAction = createAction({
	auth: pinlyxAuth,
	name: 'add_tag_to_contact',
	classification: 'WRITE',
	displayName: 'Add Tag to Contact',
	description: 'Attaches a tag to a contact. The tag is created if it does not exist yet.',
	audience: 'both',
	aiMetadata: {
		description:
			'Attach a tag, by name, to an existing Pinlyx contact; the tag is created when missing. Returns the contact full tag list. Adding a tag the contact already has changes nothing, so it is safe to retry.',
		idempotent: true,
	},
	props: {
		contactId: pinlyxProps.contactIdProp({}),
		tagName: Property.ShortText({
			displayName: 'Tag',
			description: 'The tag name, for example "hot-lead".',
			required: true,
		}),
	},
	async run(context) {
		return await pinlyxClient.apiCall({
			apiKey: context.auth.secret_text,
			method: HttpMethod.POST,
			path: `/contacts/${context.propsValue.contactId}/tags`,
			body: { tagName: context.propsValue.tagName.trim() },
		});
	},
});
