/**
 * Génère et vérifie les tokens de désabonnement.
 * Hash simple : SHA-256( email + secret )
 */

const SECRET = process.env.ADMIN_API_KEY || "fallback-secret-change-me";

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function generateUnsubscribeToken(email: string): Promise<string> {
  return sha256(email.toLowerCase().trim() + SECRET);
}

export async function verifyUnsubscribeToken(email: string, token: string): Promise<boolean> {
  const expected = await generateUnsubscribeToken(email);
  return expected === token;
}
