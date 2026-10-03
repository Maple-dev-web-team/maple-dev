// Cryptographic authentication utilities compatible with Edge and Serverless runtimes

const AUTH_SECRET =
  process.env.ADMIN_PASSWORD || "maple_secure_auth_secret_2026";

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toBase64Url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64: string): string {
  let str = b64.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

export async function createAdminSessionToken(email: string): Promise<string> {
  const enc = new TextEncoder();
  const timestamp = Date.now().toString();
  const payloadJson = JSON.stringify({ email: email.toLowerCase(), ts: timestamp });
  const payloadB64 = toBase64Url(payloadJson);
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  const hexSig = bufferToHex(signature);
  return `${payloadB64}.${hexSig}`;
}

export async function verifyAdminSessionToken(
  rawToken: string | null | undefined
): Promise<boolean> {
  if (!rawToken || typeof rawToken !== "string") return false;

  // Clean and decode any cookie URL-encoding
  const token = decodeURIComponent(rawToken).trim();
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signatureHex] = parts;
  if (!payloadB64 || !signatureHex) return false;

  let timestamp: number;
  try {
    const payloadRaw = fromBase64Url(payloadB64);
    const parsed = JSON.parse(payloadRaw);
    timestamp = parseInt(parsed.ts, 10);
  } catch {
    return false;
  }

  if (isNaN(timestamp)) return false;

  // Max age: 7 days
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAgeMs) {
    return false;
  }

  try {
    const enc = new TextEncoder();
    const key = await getHmacKey();
    const expectedSigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
    const expectedHex = bufferToHex(expectedSigBuf);

    // Constant-time string comparison to avoid timing attacks
    if (signatureHex.length !== expectedHex.length) return false;
    let diff = 0;
    for (let i = 0; i < signatureHex.length; i++) {
      diff |= signatureHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}
