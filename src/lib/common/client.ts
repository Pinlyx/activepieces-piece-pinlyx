import {
	AuthenticationType,
	httpClient,
	HttpMessageBody,
	HttpMethod,
	QueryParams,
} from '@activepieces/pieces-common';
import { isNil } from '@activepieces/pieces-framework';
import { PinlyxPage } from './types';

const PINLYX_API_URL = 'https://api.pinlyx.com/v1';
const MAX_PAGE_SIZE = 100;

async function apiCall<T extends HttpMessageBody>({
	apiKey,
	method,
	path,
	query,
	body,
}: {
	apiKey: string;
	method: HttpMethod;
	path: string;
	query?: Record<string, string | number | undefined>;
	body?: Record<string, unknown>;
}): Promise<T> {
	const response = await httpClient.sendRequest<T>({
		method,
		url: `${PINLYX_API_URL}${path}`,
		authentication: {
			type: AuthenticationType.BEARER_TOKEN,
			token: apiKey,
		},
		queryParams: toQueryParams({ query }),
		body,
	});
	return response.body;
}

async function listItems<T>({
	apiKey,
	path,
	query,
	maxItems,
}: {
	apiKey: string;
	path: string;
	query?: Record<string, string | number | undefined>;
	maxItems: number;
}): Promise<T[]> {
	const items: T[] = [];
	let after: string | undefined = undefined;
	while (items.length < maxItems) {
		const page: PinlyxPage<T> = await apiCall<PinlyxPage<T>>({
			apiKey,
			method: HttpMethod.GET,
			path,
			query: { ...query, limit: Math.min(MAX_PAGE_SIZE, maxItems - items.length), after },
		});
		items.push(...page.items);
		if (!page.hasMore || isNil(page.nextCursor)) {
			break;
		}
		after = String(page.nextCursor);
	}
	return items.slice(0, maxItems);
}

function compactBody({
	fields,
}: {
	fields: Record<string, unknown>;
}): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(fields).filter(
			([, value]) => !isNil(value) && value !== '' && !(Array.isArray(value) && value.length === 0),
		),
	);
}

function toIsoDate({ value }: { value: string | undefined }): string | undefined {
	if (isNil(value) || value === '') {
		return undefined;
	}
	return new Date(value).toISOString();
}

function toQueryParams({
	query,
}: {
	query: Record<string, string | number | undefined> | undefined;
}): QueryParams {
	const params: QueryParams = {};
	for (const [key, value] of Object.entries(query ?? {})) {
		if (!isNil(value) && value !== '') {
			params[key] = String(value);
		}
	}
	return params;
}

export const pinlyxClient = {
	apiCall,
	listItems,
	compactBody,
	toIsoDate,
};

export { PINLYX_API_URL };
