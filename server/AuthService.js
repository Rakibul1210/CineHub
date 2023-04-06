const jwt = require('jsonwebtoken');
const crypto = require('crypto')

global.secretKey = null

function setSecretKey(key) {
  global.secretKey = key;
}

function isAuthenticated(token, userID) {
  const encryptionKey = crypto.createHash('sha256').update(userID).digest();
  const iv = Buffer.alloc(16, 0);

  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

  let encryptedSecretKey = cipher.update(global.secretKey, 'utf8', 'hex');
  encryptedSecretKey += cipher.final('hex');
  console.log("Encrypted: ", encryptedSecretKey)
  try {
    jwt.verify(token, encryptedSecretKey);
    return true;
  } catch {
    return false;
  }
}

console.log(global.secretKey)

module.exports = {
  setSecretKey,
  isAuthenticated
};