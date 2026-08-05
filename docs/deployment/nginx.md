# Nginx, HTTPS, and proxying

The runtime image serves the SPA on unprivileged port 8080, falls back to `index.html` for client routes, and proxies `/api/` plus `/health/` to FastAPI. It applies a conservative CSP, frame policy, referrer policy, MIME protection, and permissions policy.

Production requires an external HTTPS ingress, reverse proxy, or load balancer:

- redirect HTTP to HTTPS;
- preserve the original host and client/proxy headers from trusted hops;
- set sensible request-body, header, idle, and upstream timeouts;
- restrict the origin to the configured hostname;
- automate certificate renewal and alert before expiry;
- rate-limit at the edge when exposed to abuse.

Review the CSP whenever adding fonts, images, analytics, error reporting, or other origins. The current policy permits the official Telegram bridge and the inline styles React uses for safe-area/avatar values. Do not add broad wildcard sources to make a new integration pass.

The included Nginx service does not manage certificates. Terminate TLS before it and forward to port 8080 over a private network.
