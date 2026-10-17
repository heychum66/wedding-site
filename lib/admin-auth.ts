// Signed admin session cookie: "<expiry ms>.<hex HMAC-SHA256(expiry, ADMIN_SECRET)>".
// Uses Web Crypto so the same code runs in proxy.ts and in route handlers.

export const ADMIN_COOKIE = "er_admin";
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const enc = new TextEncoder();

async function hmac(data: string) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 16) throw new Error("ADMIN_SECRET must be set (16+ characters).");
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createAdminToken() {
  const exp = String(Date.now() + ADMIN_MAX_AGE * 1000);
  return `${exp}.${await hmac(exp)}`;
}

export async function verifyAdminToken(token: string | undefined | null) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  try {
    return safeEqual(sig, await hmac(exp));
  } catch {
    return false;
  }
}

/** Constant-time password check against ADMIN_PASSWORD (both sides hashed first so lengths match). */
export async function checkAdminPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const [a, b] = await Promise.all([hmac("pw:" + input), hmac("pw:" + expected)]);
  return safeEqual(a, b);
}
