type PinlyxPage<T> = {
	items: T[];
	nextCursor: number | string | null;
	hasMore: boolean;
};

type PinlyxContact = {
	Id: number;
	Platform: string;
	Name: string | null;
	Username: string | null;
	Phone: string | null;
	Email: string | null;
	Company: string | null;
	ExternalId: string | null;
	Country: string | null;
	City: string | null;
	Notes: string | null;
	Stage: string | null;
	PipelineId: number | null;
	PipelineStageId: number | null;
	LeadScore: number | null;
	AssignedToUserId: number | null;
	Source: string | null;
	CreatedAt: string;
	UpdatedAt: string | null;
};

type PinlyxDeal = {
	Id: number;
	Title: string;
	ContactId: number | null;
	Value: number;
	Currency: string;
	Stage: string | null;
	Probability: number;
	ClosedAt: string | null;
	CreatedAt: string;
	UpdatedAt: string | null;
};

type PinlyxWebhookCreateResponse = {
	endpoint: { id: number };
	secret: string;
};

type PinlyxWebhookEnvelope<T> = {
	event: string;
	id: string;
	deliveredAt: string;
	data: T;
};

type PinlyxStoredWebhook = {
	webhookId: number;
	secret: string;
};

export type {
	PinlyxContact,
	PinlyxDeal,
	PinlyxPage,
	PinlyxStoredWebhook,
	PinlyxWebhookCreateResponse,
	PinlyxWebhookEnvelope,
};
