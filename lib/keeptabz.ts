import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { auth, UnauthorizedError } from "@modelcontextprotocol/sdk/client/auth.js";
import { KeeptabzOAuthProvider, verifyKeeptabzOAuthState } from "./keeptabzOAuthProvider";
import { getStoreValue } from "./keeptabzOAuthStore";

const KEEPTABZ_API_URL = process.env.KEEPTABZ_API_URL ?? "https://app.keeptabz.ai/api/mcp";

export class KeeptabzAuthRequiredError extends Error {
  constructor() {
    super("KeepTabz authorization required.");
  }
}

export async function isKeeptabzAuthorized(): Promise<boolean> {
  const tokens = await getStoreValue("tokens");
  return Boolean(tokens);
}

export async function startKeeptabzAuthorization(): Promise<
  { alreadyAuthorized: true } | { alreadyAuthorized: false; authorizationUrl: string }
> {
  const provider = new KeeptabzOAuthProvider();
  const result = await auth(provider, { serverUrl: KEEPTABZ_API_URL });

  if (result === "AUTHORIZED") {
    return { alreadyAuthorized: true };
  }

  if (!provider.lastAuthorizationUrl) {
    throw new Error("KeepTabz did not return an authorization URL.");
  }

  return { alreadyAuthorized: false, authorizationUrl: provider.lastAuthorizationUrl.toString() };
}

export async function completeKeeptabzAuthorization(code: string, state: string | null): Promise<void> {
  const stateValid = await verifyKeeptabzOAuthState(state);
  if (!stateValid) {
    throw new Error("KeepTabz OAuth state mismatch.");
  }

  const provider = new KeeptabzOAuthProvider();
  const result = await auth(provider, { serverUrl: KEEPTABZ_API_URL, authorizationCode: code });

  if (result !== "AUTHORIZED") {
    throw new Error("KeepTabz authorization did not complete.");
  }

  // Force the next tool call to reconnect using the freshly stored tokens.
  clientPromise = null;
}

export type KeeptabzSocialProfile = {
  social: string;
  accountType: string;
  url: string;
  followers: number | null;
};

export type KeeptabzCompetitor = {
  id: number;
  name: string;
  websiteUrl: string | null;
  overview: string | null;
  g2ReviewsUrl?: string | null;
  trustRadiusReviewsUrl?: string | null;
  capterraReviewsUrl?: string | null;
  softwareAdviceReviewsUrl?: string | null;
  trustpilotReviewsUrl?: string | null;
  socialProfiles?: KeeptabzSocialProfile[];
};

export type KeeptabzWorkspace = {
  id: number;
  name: string;
  slug: string;
  competitorsCount: number;
};

// Reused across requests within the same server process; reset on failure so the next call reconnects.
let clientPromise: Promise<Client> | null = null;

async function getClient(): Promise<Client> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const transport = new StreamableHTTPClientTransport(new URL(KEEPTABZ_API_URL), {
        authProvider: new KeeptabzOAuthProvider(),
      });
      const client = new Client({ name: "welink-demo", version: "0.1.0" });
      await client.connect(transport);
      return client;
    })().catch((error: unknown) => {
      clientPromise = null;
      throw error;
    });
  }

  return clientPromise;
}

async function callKeeptabzTool<T>(name: string, args: Record<string, unknown> = {}): Promise<T> {
  try {
    const client = await getClient();
    const result = await client.callTool({ name, arguments: args });
    const textBlock = result.content.find(
      (block): block is { type: "text"; text: string } => block.type === "text"
    );

    if (!textBlock) {
      throw new Error(`KeepTabz tool "${name}" returned no text content.`);
    }

    return JSON.parse(textBlock.text) as T;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new KeeptabzAuthRequiredError();
    }
    throw error;
  }
}

export async function listWorkspaces() {
  return callKeeptabzTool<{ workspaces: KeeptabzWorkspace[] }>("LIST_WORKSPACES");
}

export async function listCompetitors(params: { workspaceSlug?: string; search?: string } = {}) {
  return callKeeptabzTool<{ competitors: KeeptabzCompetitor[] }>("LIST_COMPETITORS", params);
}
