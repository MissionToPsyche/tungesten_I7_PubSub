require('dotenv').config();
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Ensure this is 32 bytes for aes-256-ctr
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Middleware to decrypt request bodies
const decryptRequest = (req, res, next) => {
    if (req.body && Object.keys(req.body).length !== 0) {
        try {
            const decryptedBody = decrypt(req.body.data); // Assuming the encrypted data is sent in a 'data' property
            req.body = JSON.parse(decryptedBody);
        } catch (error) {
            return res.status(500).json({ message: 'Decryption failed' });
        }
    }
    next();
};

module.exports = { decryptRequest, encrypt, decrypt };