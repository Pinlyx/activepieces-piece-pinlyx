import { HttpMethod } from '@activepieces/pieces-common';
import { createAction, Property } from '@activepieces/pieces-framework';
import { pinlyxAuth } from '../auth';
import { pinlyxClient } from '../common/client';

export const createTaskAction = createAction({
	auth: pinlyxAuth,
	name: 'create_task',
	classification: 'WRITE',
	displayName: 'Create Task',
	description: 'Creates a task or reminder, optionally linked to a contact or a deal.',
	audience: 'both',
	aiMetadata: {
		description:
			'Create a CRM task or reminder in Pinlyx, optionally linked to a contact and or a deal and with a due date. Each call creates a new task, so retries duplicate.',
		idempotent: false,
	},
	props: {
		title: Property.ShortText({
			displayName: 'Title',
			description: 'What needs to be done, for example "Call Jane about the proposal".',
			required: true,
		}),
		description: Property.LongText({
			displayName: 'Description',
			required: false,
		}),
		contactId: Property.Number({
			displayName: 'Contact ID',
			description: 'Links the task to a contact. Map it from a previous step.',
			required: false,
		}),
		dealId: Property.Number({
			displayName: 'Deal ID',
			description: 'Links the task to a deal. Map it from a previous step.',
			required: false,
		}),
		priority: Property.StaticDropdown({
			displayName: 'Priority',
			description: 'Defaults to Medium.',
			required: false,
			options: {
				options: [
					{ label: 'Low', value: 'low' },
					{ label: 'Medium', value: 'medium' },
					{ label: 'High', value: 'high' },
				],
			},
		}),
		dueAt: Property.DateTime({
			displayName: 'Due Date',
			required: false,
		}),
	},
	async run(context) {
		const { title, description, contactId, dealId, priority, dueAt } = context.propsValue;
		return await pinlyxClient.apiCall({
			apiKey: context.auth.secret_text,
			method: HttpMethod.POST,
			path: '/tasks',
			body: pinlyxClient.compactBody({
				fields: {
					title,
					description,
					contactId,
					dealId,
					priority,
					dueAt: pinlyxClient.toIsoDate({ value: dueAt }),
				},
			}),
		});
	},
});
