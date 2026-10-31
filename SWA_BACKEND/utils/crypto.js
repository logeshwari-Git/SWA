const crypto = require("crypto");

const secret = crypto
  .createHash("sha256")
  .update(process.env.JOURNAL_SECRET || "journal-secret")
  .digest();

const ivLength = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv("aes-256-cbc", secret, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

function decrypt(payload) {
  if (!payload) return "";
  const [ivHex, dataHex] = payload.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    secret,
    Buffer.from(ivHex, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final()
  ]);
  return decrypted.toString("utf8");
}

module.exports = { encrypt, decrypt };
