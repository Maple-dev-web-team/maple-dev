// Cryptographic authentication utilities compatible with Edge and Serverless runtimes

const AUTH_SECRET =
  process.env.ADMIN_PASSWORD ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "maple_secure_fallback_salt_2026";

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

export async function createAdminSessionToken(email: string): Promise<string> {
  const enc = new TextEncoder();
  const timestamp = Date.now().toString();
  const payload = `${email}:${timestamp}`;
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const hexSig = bufferToHex(signature);
  return `${payload}.${hexSig}`;
}

export async function verifyAdminSessionToken(
  token: string | null | undefined
): Promise<boolean> {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signatureHex] = parts;
  const [email, timestampStr] = payload.split(":");
  if (!email || !timestampStr) return false;

  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Max age: 7 days
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAgeMs) {
    return false;
  }

  try {
    const enc = new TextEncoder();
    const key = await getHmacKey();
    const expectedSigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
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
