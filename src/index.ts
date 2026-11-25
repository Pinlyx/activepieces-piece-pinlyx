import { createCustomApiCallAction } from '@activepieces/pieces-common';
import { createPiece, PieceCategory } from '@activepieces/pieces-framework';
import { addTagToContactAction } from './lib/actions/add-tag-to-contact';
import { createContactAction } from './lib/actions/create-contact';
import { createDealAction } from './lib/actions/create-deal';
import { createTaskAction } from './lib/actions/create-task';
import { searchContactsAction } from './lib/actions/search-contacts';
import { updateContactAction } from './lib/actions/update-contact';
import { updateDealStageAction } from './lib/actions/update-deal-stage';
import { pinlyxAuth } from './lib/auth';
import { PINLYX_API_URL } from './lib/common/client';
import { dealStageChangedTrigger } from './lib/triggers/deal-stage-changed';
import { newContactTrigger } from './lib/triggers/new-contact';

export const pinlyx = createPiece({
	displayName: 'Pinlyx',
	description:
		'CRM for Telegram, X and other messaging channels: contacts, deals, tasks and conversations in one workspace.',
	auth: pinlyxAuth,
	minimumSupportedRelease: '0.88.2',
	logoUrl: 'https://pinlyx.com/favicon/android-chrome-512x512.png',
	categories: [PieceCategory.SALES_AND_CRM],
	authors: ['pinlyx'],
	actions: [
		createContactAction,
		updateContactAction,
		addTagToContactAction,
		createDealAction,
		updateDealStageAction,
		createTaskAction,
		searchContactsAction,
		createCustomApiCallAction({
			auth: pinlyxAuth,
			baseUrl: () => PINLYX_API_URL,
			authMapping: async (auth) => ({
				Authorization: `Bearer ${auth.secret_text}`,
			}),
		}),
	],
	triggers: [newContactTrigger, dealStageChangedTrigger],
});
