import { Property } from '@activepieces/pieces-framework';

const contactStageOptions = [
	{ label: 'No value', value: 'novalue' },
	{ label: 'Lead', value: 'lead' },
	{ label: 'Conversation', value: 'conversation' },
	{ label: 'Proposal', value: 'proposal' },
	{ label: 'Negotiation', value: 'negotiation' },
	{ label: 'Won', value: 'won' },
	{ label: 'Lost', value: 'lost' },
];

const dealStageOptions = [
	{ label: 'Lead', value: 'lead' },
	{ label: 'Qualified', value: 'qualified' },
	{ label: 'Proposal', value: 'proposal' },
	{ label: 'Negotiation', value: 'negotiation' },
];

const movableDealStageOptions = [...dealStageOptions, { label: 'Lost', value: 'lost' }];

const contactIdProp = ({ description }: { description?: string }) =>
	Property.Number({
		displayName: 'Contact ID',
		description:
			description ??
			'The Pinlyx contact ID, for example 1842. Map it from a previous step such as Create Contact or Search Contacts.',
		required: true,
	});

export const pinlyxProps = {
	contactStageOptions,
	dealStageOptions,
	movableDealStageOptions,
	contactIdProp,
};
