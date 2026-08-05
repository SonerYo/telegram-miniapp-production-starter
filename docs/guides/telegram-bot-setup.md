# Telegram bot setup

This repository does not create a bot or change Telegram settings.

1. Open the verified `@BotFather` account and create or select a bot.
2. Keep the returned token in a secret manager or an untracked local `.env`; set `TELEGRAM_BOT_TOKEN` only on the API.
3. Deploy the Nginx web service behind a public HTTPS origin. A Telegram Mini App cannot use a production `localhost` URL.
4. Configure a Menu Button or Mini App URL for that HTTPS origin through BotFather.
5. Launch from Telegram. Inspect the API health endpoint, confirm `/api/v1/me` succeeds, and confirm the profile displays **Verified by backend**.
6. Test light/dark themes, Android/iOS clients, compact/expanded viewport, BackButton, closing confirmation, and safe-area behavior.

The frontend sends the raw `Telegram.WebApp.initData`; it never sends `initDataUnsafe` as proof. If validation fails, compare server time, bot token, init data age, request transport, and the configured header scheme. Never paste real init data into an issue or log.

See Telegram's official [validating data received via the Mini App](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app) section for the protocol definition.
