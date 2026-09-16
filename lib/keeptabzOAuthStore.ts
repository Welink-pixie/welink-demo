import { prisma } from "./db";

// OAuth state is namespaced by base URL (dev vs. prod) since both share one database, and a
// client registered with a localhost redirect URI must never be reused for a prod redirect URI.
type KeeptabzOAuthState = {
  clientInformation?: unknown;
  tokens?: unknown;
  codeVerifier?: string;
  oauthState?: string;
  discoveryState?: unknown;
};

const JSON_FIELDS = new Set<keyof KeeptabzOAuthState>(["clientInformation", "tokens", "discoveryState"]);

function serialize<K extends keyof KeeptabzOAuthState>(key: K, value: KeeptabzOAuthState[K]): string | null {
  if (value === undefined) return null;
  return JSON_FIELDS.has(key) ? JSON.stringify(value) : (value as string);
}

function deserialize<K extends keyof KeeptabzOAuthState>(key: K, raw: string | null): KeeptabzOAuthState[K] {
  if (raw == null) return undefined as KeeptabzOAuthState[K];
  return (JSON_FIELDS.has(key) ? JSON.parse(raw) : raw) as KeeptabzOAuthState[K];
}

export async function getStoreValue<K extends keyof KeeptabzOAuthState>(
  namespace: string,
  key: K
): Promise<KeeptabzOAuthState[K]> {
  const row = await prisma.keeptabzOAuthState.findUnique({ where: { id: namespace } });
  if (!row) return undefined as KeeptabzOAuthState[K];
  return deserialize(key, row[key] as string | null);
}

export async function setStoreValue<K extends keyof KeeptabzOAuthState>(
  namespace: string,
  key: K,
  value: KeeptabzOAuthState[K]
): Promise<void> {
  const serialized = serialize(key, value);
  await prisma.keeptabzOAuthState.upsert({
    where: { id: namespace },
    create: { id: namespace, [key]: serialized },
    update: { [key]: serialized },
  });
}

export async function clearStoreValues(namespace: string, keys?: (keyof KeeptabzOAuthState)[]): Promise<void> {
  const fields = keys ?? ["clientInformation", "tokens", "codeVerifier", "oauthState", "discoveryState"];
  const data = Object.fromEntries(fields.map((field) => [field, null]));

  await prisma.keeptabzOAuthState
    .upsert({
      where: { id: namespace },
      create: { id: namespace, ...data },
      update: data,
    })
    .catch(() => {
      // Nothing to clear if the row never existed.
    });
}
