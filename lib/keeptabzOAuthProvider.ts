import { randomUUID } from "crypto";
import type { OAuthClientProvider } from "@modelcontextprotocol/sdk/client/auth.js";
import type {
  OAuthClientInformationMixed,
  OAuthClientMetadata,
  OAuthTokens,
} from "@modelcontextprotocol/sdk/shared/auth.js";
import { clearStoreValues, getStoreValue, setStoreValue } from "./keeptabzOAuthStore";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";
const REDIRECT_URL = `${APP_URL}/api/keeptabz/oauth/callback`;

// Server-side OAuth client for the KeepTabz MCP endpoint (RFC 9728 protected resource + DCR + PKCE).
// All state lives in keeptabzOAuthStore.ts, not in this instance, since a new provider is created per request.
export class KeeptabzOAuthProvider implements OAuthClientProvider {
  lastAuthorizationUrl?: URL;

  get redirectUrl() {
    return REDIRECT_URL;
  }

  get clientMetadata(): OAuthClientMetadata {
    return {
      redirect_uris: [REDIRECT_URL],
      client_name: "WeLink",
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
      // KeepTabz's protected-resource metadata omits scopes_supported, so the SDK can't infer
      // a default; the authorization server itself only supports "mcp:read" / "mcp:admin".
      scope: "mcp:read",
    };
  }

  async state() {
    const state = randomUUID();
    await setStoreValue("oauthState", state);
    return state;
  }

  async clientInformation() {
    return (await getStoreValue("clientInformation")) as OAuthClientInformationMixed | undefined;
  }

  async saveClientInformation(info: OAuthClientInformationMixed) {
    await setStoreValue("clientInformation", info);
  }

  async tokens() {
    return (await getStoreValue("tokens")) as OAuthTokens | undefined;
  }

  async saveTokens(tokens: OAuthTokens) {
    await setStoreValue("tokens", tokens);
  }

  async redirectToAuthorization(authorizationUrl: URL) {
    this.lastAuthorizationUrl = authorizationUrl;
  }

  async saveCodeVerifier(codeVerifier: string) {
    await setStoreValue("codeVerifier", codeVerifier);
  }

  async codeVerifier() {
    const verifier = await getStoreValue("codeVerifier");
    if (!verifier) {
      throw new Error("No PKCE code verifier stored for KeepTabz OAuth exchange.");
    }
    return verifier;
  }

  async invalidateCredentials(scope: "all" | "client" | "tokens" | "verifier" | "discovery") {
    if (scope === "all") {
      await clearStoreValues();
      return;
    }
    const keyMap = {
      client: "clientInformation",
      tokens: "tokens",
      verifier: "codeVerifier",
      discovery: "discoveryState",
    } as const;
    await clearStoreValues([keyMap[scope]]);
  }

  async saveDiscoveryState(state: unknown) {
    await setStoreValue("discoveryState", state);
  }

  async discoveryState() {
    return await getStoreValue("discoveryState");
  }
}

export async function verifyKeeptabzOAuthState(candidate: string | null): Promise<boolean> {
  if (!candidate) return false;
  const stored = await getStoreValue("oauthState");
  return Boolean(stored) && stored === candidate;
}
