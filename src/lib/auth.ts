import { scryptSync, randomBytes, timingSafeEqual, createHmac } from "crypto";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "glenda_royale_default_secret_key_2026_rf903rhu";

// --- Password Hashing ---

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) return false;
    const verifyHash = scryptSync(password, salt, 64).toString("hex");
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(verifyHash, "hex"));
  } catch (e) {
    return false;
  }
}

// --- Session Signing & Verification ---

export function signSession(email: string): string {
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 Hours
  const payload = JSON.stringify({ email, expiry });
  const payloadBase64 = Buffer.from(payload).toString("base64");
  const signature = createHmac("sha256", JWT_SECRET).update(payloadBase64).digest("hex");
  return `${payloadBase64}.${signature}`;
}

export function verifySession(token: string): { email: string } | null {
  try {
    const [payloadBase64, signature] = token.split(".");
    if (!payloadBase64 || !signature) return null;

    const expectedSignature = createHmac("sha256", JWT_SECRET).update(payloadBase64).digest("hex");
    if (signature !== expectedSignature) return null;

    const payloadStr = Buffer.from(payloadBase64, "base64").toString("utf8");
    const { email, expiry } = JSON.parse(payloadStr);

    if (Date.now() > expiry) return null; // Session expired

    return { email };
  } catch (err) {
    return null;
  }
}
