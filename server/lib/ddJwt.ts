// =============================================================
// VISHVA FOODS — DoorDash Drive JWT signer
// DoorDash requires a short-lived HS256 JWT with a custom header
// ("dd-ver": "DD-JWT-V1"). The signing_secret from the portal is
// URL-safe base64 encoded and must be decoded before use as the
// HMAC key. Implemented with Node's crypto so we add no deps.
// Docs: https://developer.doordash.com/en-US/docs/drive/reference/JWTs/
// =============================================================
import crypto from "node:crypto";

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function createDoorDashJwt(opts: {
  developerId: string;
  keyId: string;
  signingSecret: string; // URL-safe base64 from the portal
}): string {
  const { developerId, keyId, signingSecret } = opts;

  const header = {
    alg: "HS256",
    "dd-ver": "DD-JWT-V1",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: "doordash",
    iss: developerId,
    kid: keyId,
    iat: now,
    exp: now + 60 * 5, // 5 minutes
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  // The portal secret is URL-safe base64; decode to raw bytes for the HMAC key.
  const secretBytes = Buffer.from(signingSecret, "base64");

  const signature = crypto
    .createHmac("sha256", secretBytes)
    .update(signingInput)
    .digest();

  return `${signingInput}.${base64url(signature)}`;
}
