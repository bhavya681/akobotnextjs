import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api.akobot.in";

async function proxy(method: string, req: NextRequest, path: string[]) {
  const pathStr = path.join("/");
  const url = `${BASE.replace(/\/$/, "")}/${pathStr}${req.nextUrl.search}`;
  const headers: Record<string, string> = {};
  ["authorization", "content-type", "accept"].forEach((k) => {
    const v = req.headers.get(k);
    if (v) headers[k] = v;
  });
  let body: ArrayBuffer | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const b = await req.arrayBuffer();
    if (b.byteLength > 0) body = b;
  }
  const res = await fetch(url, {
    method,
    headers: Object.keys(headers).length ? headers : undefined,
    body,
    cache: "no-store",
  });
  const out = new Headers();
  res.headers.forEach((v, k) => {
    if (["content-type", "content-length"].includes(k.toLowerCase())) out.set(k, v);
  });
  return new NextResponse(await res.arrayBuffer(), {
    status: res.status,
    statusText: res.statusText,
    headers: out,
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  return proxy("GET", req, path).catch((e) =>
    NextResponse.json({ error: "Proxy failed", details: String(e) }, { status: 502 })
  );
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  return proxy("POST", req, path).catch((e) =>
    NextResponse.json({ error: "Proxy failed", details: String(e) }, { status: 502 })
  );
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  return proxy("PATCH", req, path).catch((e) =>
    NextResponse.json({ error: "Proxy failed", details: String(e) }, { status: 502 })
  );
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  return proxy("PUT", req, path).catch((e) =>
    NextResponse.json({ error: "Proxy failed", details: String(e) }, { status: 502 })
  );
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  return proxy("DELETE", req, path).catch((e) =>
    NextResponse.json({ error: "Proxy failed", details: String(e) }, { status: 502 })
  );
}
