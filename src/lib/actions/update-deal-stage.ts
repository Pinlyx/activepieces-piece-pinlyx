import { HttpMethod } from '@activepieces/pieces-common';
import { createAction, Property } from '@activepieces/pieces-framework';
import { pinlyxAuth } from '../auth';
import { pinlyxClient } from '../common/client';
import { pinlyxProps } from '../common/props';

export const updateDealStageAction = createAction({
	auth: pinlyxAuth,
	name: 'update_deal_stage',
	classification: 'WRITE',
	displayName: 'Update Deal Stage',
	description: 'Moves a deal to another stage of your sales pipeline.',
	audience: 'both',
	aiMetadata: {
		description:
			'Move an existing Pinlyx deal to a new stage (lead, qualified, proposal, negotiation or lost). Closing a deal as won is not possible through the API because it books revenue; do that in the Pinlyx app. Moving a deal to the stage it is already in changes nothing, so it is safe to retry.',
		idempotent: true,
	},
	props: {
		dealId: Property.Number({
			displayName: 'Deal ID',
			description:
				'The Pinlyx deal ID, for example 311. Map it from a previous step such as Create Deal or the Deal Stage Changed trigger.',
			required: true,
		}),
		stage: Property.StaticDropdown({
			displayName: 'New Stage',
			description: 'Won is not available here. Close a deal as won from the Pinlyx app.',
			required: true,
			options: { options: pinlyxProps.movableDealStageOptions },
		}),
	},
	async run(context) {
		return await pinlyxClient.apiCall({
			apiKey: context.auth.secret_text,
			method: HttpMethod.POST,
			path: `/deals/${context.propsValue.dealId}/stage`,
			body: { stage: context.propsValue.stage },
		});
	},
});
