# KeepTabz API Integration — Feedback Summary

**Date:** 2026-09-15
**Reported by:** WeLink engineering (integration attempt against `app.keeptabz.ai`)
**Audience:** KeepTabz product/API team

## Summary

We attempted a standard server-to-server integration with the KeepTabz MCP API
(`https://app.keeptabz.ai/api/mcp`) using an API key copied from the account
dashboard. The key was rejected with a generic `401 invalid_token` error. Root-cause
investigation showed the endpoint does **not** actually support static API-key
authentication at all — it requires a full OAuth 2.0 flow (dynamic client
registration + PKCE authorization code exchange). Nothing in the dashboard or the
error response makes this clear up front, which cost significant integration time.

## What we did

1. Copied what appeared to be an API key from the KeepTabz account/workspace UI.
2. Sent it as a standard `Authorization: Bearer <key>` header to
   `https://app.keeptabz.ai/api/mcp`, per common REST/API-key conventions.
3. Received: `{"error":"invalid_token","error_description":"No authorization provided"}`
   (HTTP 401).
4. Re-tested with a freshly copied key directly from the site — identical result,
   confirming the key itself was not the problem.

## Root cause

The 401 response's `WWW-Authenticate` header reveals the real requirement:

```
WWW-Authenticate: Bearer error="invalid_token",
  error_description="No authorization provided",
  resource_metadata="https://app.keeptabz.ai/api/mcp/.well-known/oauth-protected-resource"
```

This points to an **RFC 9728 OAuth Protected Resource Metadata** document, meaning
the MCP endpoint is fronted by full OAuth 2.0 (authorization code + PKCE, with
dynamic client registration), not a bearer-token API key. There does not appear to
be a simpler, static server-to-server credential option for this endpoint.

## Why this is a problem

- **Mismatched expectations:** The dashboard presents a copyable key in a format
  (`ktz_...`) that looks exactly like a conventional static API key. Nothing in the
  UI or the 401 error body indicates OAuth is required instead.
- **Generic error message:** `"No authorization provided"` reads like a missing
  header, not "wrong auth model entirely." Engineers will naturally retry with the
  same key, assume it's expired/invalid, or file it as "broken," rather than
  realizing an entirely different auth flow is needed.
- **High integration cost:** Supporting this correctly requires implementing OAuth
  discovery, dynamic client registration (RFC 7591), PKCE, authorization-code
  exchange, and token refresh/storage — a full OAuth client — just to make one
  read-only API call. This is a much bigger lift than the "paste a key and go"
  experience most integrators expect from an API-key-labeled credential.
- **No visible alternative:** If a simpler static-key REST API exists separately
  from the OAuth-protected MCP endpoint, it isn't discoverable from where the key is
  issued.

## Recommendation to KeepTabz

1. **Document the auth model clearly** wherever the key is issued: state explicitly
   that the MCP endpoint requires OAuth (not the key itself as a bearer token), and
   link to setup instructions / sample client code.
2. **Improve the error message** — surface something like `"This endpoint requires
   OAuth authorization; see <docs link>"` instead of a generic invalid-token message
   that reads like a header formatting mistake.
3. **Offer a static server-to-server API key** for simple/read-only integrations
   (a common pattern alongside MCP/OAuth for interactive agent use), or clearly
   separate "OAuth app" credentials from "API key" credentials in the dashboard UI
   so they aren't visually interchangeable.

## Status on our side

We're implementing a full OAuth client (discovery, DCR, PKCE, token storage/refresh)
in the WeLink app to work around this. It's a bigger lift than originally scoped,
but functional.
