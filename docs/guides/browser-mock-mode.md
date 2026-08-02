# Browser mock mode

Browser mock mode provides a synthetic Telegram user and host surface for ordinary browser development. A persistent badge makes the mode visible.

Run `pnpm --filter @starter/web dev`. By default the mock API stores tasks in memory. Set `VITE_API_MODE=http` to call FastAPI; in that case the API must run outside production with `DEV_MOCK_AUTH=true`.

The Developer Preview page can change:

- Telegram light and dark themes;
- viewport and content safe-area insets;
- online/offline state and simulated latency;
- empty task data and forced API errors.

## Security boundary

The browser module is loaded through an `import.meta.env.DEV` branch. Production builds do not include its control-panel marker. Backend development identity also has two independent runtime guards: environment and explicit flag. Production settings fail if the flag is enabled.

Mock mode validates application behavior, not Telegram's transport, client chrome, device keyboard, or the authenticity algorithm. Perform the real-client checklist before deployment.
