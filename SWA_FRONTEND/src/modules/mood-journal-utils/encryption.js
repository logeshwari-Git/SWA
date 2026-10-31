import CryptoJS from "crypto-js";

const SECRET_KEY = "journal_secret_key";

export const encrypt = (text) => CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
export const decrypt = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
