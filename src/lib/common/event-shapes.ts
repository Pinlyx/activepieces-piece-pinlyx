import { PinlyxContact, PinlyxDeal } from './types';

function contactToEventData({ contact }: { contact: PinlyxContact }) {
	return {
		id: contact.Id,
		externalId: contact.ExternalId,
		name: contact.Name,
		username: contact.Username,
		email: contact.Email,
		phone: contact.Phone,
		company: contact.Company,
		country: contact.Country,
		city: contact.City,
		platform: contact.Platform,
		source: contact.Source?.toLowerCase() ?? null,
		stage: contact.Stage?.toLowerCase() ?? null,
		pipelineId: contact.PipelineId,
		pipelineStageId: contact.PipelineStageId,
		leadScore: contact.LeadScore,
		assignedToUserId: contact.AssignedToUserId,
		createdAt: contact.CreatedAt,
		updatedAt: contact.UpdatedAt,
	};
}

function dealToStageChangeEventData({ deal }: { deal: PinlyxDeal }) {
	return {
		id: deal.Id,
		title: deal.Title,
		contactId: deal.ContactId,
		value: deal.Value,
		currency: deal.Currency,
		fromStage: null,
		toStage: deal.Stage?.toLowerCase() ?? null,
		probability: deal.Probability,
		closedAt: deal.ClosedAt,
		changedAt: deal.UpdatedAt ?? deal.CreatedAt,
	};
}

export const pinlyxEventShapes = {
	contactToEventData,
	dealToStageChangeEventData,
};
