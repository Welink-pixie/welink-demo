import { NextResponse } from "next/server";

type ValidationRequest = {
  urls?: string[];
};

type ValidationResult = {
  url: string;
  reachable: boolean;
  statusCode: number | null;
  checkedAt: string;
  error?: string;
};

const MAX_URLS = 50;

function isHttpUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

async function tryFetch(url: string, method: "HEAD" | "GET") {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "User-Agent": "WeLink-SourceValidator/1.0",
      },
    });

    return {
      ok: response.ok,
      status: response.status,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function validateUrl(url: string): Promise<ValidationResult> {
  const checkedAt = new Date().toISOString();

  if (!isHttpUrl(url)) {
    return {
      url,
      reachable: false,
      statusCode: null,
      checkedAt,
      error: "Unsupported URL scheme",
    };
  }

  try {
    const headResult = await tryFetch(url, "HEAD");

    if (headResult.status === 405 || headResult.status === 501) {
      const getResult = await tryFetch(url, "GET");
      const reachable = getResult.status !== 404 && getResult.status < 500;
      return {
        url,
        reachable,
        statusCode: getResult.status,
        checkedAt,
      };
    }

    const reachable = headResult.status !== 404 && headResult.status < 500;
    return {
      url,
      reachable,
      statusCode: headResult.status,
      checkedAt,
    };
  } catch (error) {
    return {
      url,
      reachable: false,
      statusCode: null,
      checkedAt,
      error: error instanceof Error ? error.message : "Unknown validation error",
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ValidationRequest;
    const urls = Array.from(new Set((body.urls ?? []).filter((url): url is string => typeof url === "string")));

    if (urls.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const trimmed = urls.slice(0, MAX_URLS);
    const results = await Promise.all(trimmed.map((url) => validateUrl(url)));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Unable to validate sources." }, { status: 500 });
  }
}
