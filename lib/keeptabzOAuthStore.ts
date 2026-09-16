import { promises as fs } from "fs";
import path from "path";

// Single-tenant token store for the demo: one server-wide KeepTabz connection, persisted to disk
// so it survives dev-server restarts. Never commit this file (see .gitignore).
type KeeptabzOAuthState = {
  clientInformation?: unknown;
  tokens?: unknown;
  codeVerifier?: string;
  oauthState?: string;
  discoveryState?: unknown;
};

const STORE_PATH = path.join(process.cwd(), ".tmp", "keeptabz-oauth.json");

async function readStore(): Promise<KeeptabzOAuthState> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as KeeptabzOAuthState;
  } catch {
    return {};
  }
}

async function writeStore(next: KeeptabzOAuthState): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(next, null, 2), "utf8");
}

export async function getStoreValue<K extends keyof KeeptabzOAuthState>(
  key: K
): Promise<KeeptabzOAuthState[K]> {
  const store = await readStore();
  return store[key];
}

export async function setStoreValue<K extends keyof KeeptabzOAuthState>(
  key: K,
  value: KeeptabzOAuthState[K]
): Promise<void> {
  const store = await readStore();
  store[key] = value;
  await writeStore(store);
}

export async function clearStoreValues(keys?: (keyof KeeptabzOAuthState)[]): Promise<void> {
  if (!keys) {
    await writeStore({});
    return;
  }
  const store = await readStore();
  for (const key of keys) {
    delete store[key];
  }
  await writeStore(store);
}
