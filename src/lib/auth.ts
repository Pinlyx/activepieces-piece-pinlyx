import { AuthenticationType, httpClient, HttpMethod } from '@activepieces/pieces-common';
import { PieceAuth } from '@activepieces/pieces-framework';

const markdownDescription = `
To connect Pinlyx you need an API key:
1. Log in to Pinlyx at https://app.pinlyx.com.
2. Open **Settings > Developers** and stay on the **API keys** tab.
3. Click **Create key**, give it a name and choose **Live**.
4. Tick the scopes this piece uses: \`contacts:read\`, \`contacts:write\`, \`deals:read\`, \`deals:write\`, \`tasks:read\`, \`tasks:write\`, \`webhooks:read\` and \`webhooks:write\`.
5. Copy the token (it starts with \`csk_live_\`) and paste it here. Pinlyx shows it only once.

API keys are part of the Pinlyx Business plan.
`;

type MeResponse = {
	email?: string;
	name?: string;
};

const pinlyxAuth = PieceAuth.SecretText({
	displayName: 'API Key',
	description: markdownDescription,
	required: true,
	validate: async ({ auth }) => {
		try {
			await httpClient.sendRequest({
				method: HttpMethod.GET,
				url: 'https://api.pinlyx.com/v1/me',
				authentication: {
					type: AuthenticationType.BEARER_TOKEN,
					token: auth,
				},
			});
			return { valid: true };
		} catch {
			return { valid: false, error: 'Invalid API key. Create one in Settings > Developers in Pinlyx.' };
		}
	},
	getConnectionIdentifier: async ({ auth }) => {
		try {
			const response = await httpClient.sendRequest<MeResponse>({
				method: HttpMethod.GET,
				url: 'https://api.pinlyx.com/v1/me',
				authentication: {
					type: AuthenticationType.BEARER_TOKEN,
					token: auth,
				},
			});
			return response.body.email ?? response.body.name;
		} catch {
			return undefined;
		}
	},
});

export { pinlyxAuth };
