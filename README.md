# activepieces-piece-pinlyx

Activepieces piece for [Pinlyx](https://pinlyx.com), the CRM for Telegram, X and other messaging channels. It connects a flow to the Pinlyx public API (`https://api.pinlyx.com/v1`).

## Install

On Activepieces Cloud or a self-hosted instance:

1. Open **Settings > My Pieces > Install Piece**.
2. Type the package name `activepieces-piece-pinlyx` and install it.
3. Add the **Pinlyx** piece to a flow and create a connection with your API key.

## Connect

1. Log in at https://app.pinlyx.com and open **Settings > Developers > API keys**.
2. Click **Create key**, choose **Live** and tick `contacts:read`, `contacts:write`, `deals:read`, `deals:write`, `tasks:read`, `tasks:write`, `webhooks:read`, `webhooks:write`.
3. Copy the token (it starts with `csk_live_`) and paste it into the connection. Pinlyx shows it only once.

API keys are part of the Pinlyx **Business** plan.

## What it does

Actions: Create Contact, Update Contact, Add Tag to Contact, Search Contacts, Create Deal, Update Deal Stage, Create Task, and a Custom API Call for any other endpoint.

Triggers (webhooks, registered and removed automatically): New Contact, Deal Stage Changed.

## Build

Activepieces does not publish its `@activepieces/*` libraries to npm. Like its own pieces, this one is shipped as a single bundled file (`src/index.js`) with the framework inlined from a pinned Activepieces commit.

```bash
npm install
npm run setup       # fetches the pinned Activepieces sources into .activepieces/
npm run typecheck   # tsc against those sources
npm run build       # writes dist/ (the publishable package)
cd dist && npm pack
```

## License

MIT. The bundle includes code from Activepieces (MIT, https://github.com/activepieces/activepieces).
