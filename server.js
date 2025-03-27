const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

app.post('/encrypt', upload.single('file'), async (req, res) => {
    const { algorithm, key, mode } = req.body;
    let plaintext = req.body.plaintext || '';
    let filename = req.file ? req.file.filename : null;

    if (req.file) {
        plaintext = fs.readFileSync(path.join(__dirname, 'uploads', filename), 'utf8');
    }

    try {
        let encrypted;
        switch (algorithm) {
            case 'OTP':
                if (plaintext.length > key.length) {
                    throw new Error('For OTP, key length must be at least as long as the plaintext');
                }
                encrypted = otpEncrypt(plaintext, key);
                break;
            case '3DES':
                encrypted = encrypt3DES(plaintext, key, mode || 'CBC');
                break;
            case 'AES':
                encrypted = encryptAES(plaintext, key, mode || 'CBC');
                break;
            default:
                throw new Error('Unsupported algorithm');
        }

        res.json({ encrypted, filename });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/decrypt', upload.single('file'), async (req, res) => {
    const { algorithm, key, mode } = req.body;
    let ciphertext = req.body.ciphertext || '';
    let filename = req.file ? req.file.filename : null;

    if (req.file) {
        ciphertext = fs.readFileSync(path.join(__dirname, 'uploads', filename), 'utf8');
    }

    try {
        let decrypted;
        switch (algorithm) {
            case 'OTP':
                decrypted = otpDecrypt(ciphertext, key);
                break;
            case '3DES':
                decrypted = decrypt3DES(ciphertext, key, mode || 'CBC');
                break;
            case 'AES':
                decrypted = decryptAES(ciphertext, key, mode || 'CBC');
                break;
            default:
                throw new Error('Unsupported algorithm');
        }

        res.json({ decrypted, filename });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// OTP Encryption/Decryption
function otpEncrypt(plaintext, key) {
    const plaintextBuf = Buffer.from(plaintext, 'utf8');
    const keyBuf = Buffer.from(key, 'utf8');
    let ciphertext = Buffer.alloc(plaintextBuf.length);

    for (let i = 0; i < plaintextBuf.length; i++) {
        ciphertext[i] = plaintextBuf[i] ^ keyBuf[i % keyBuf.length];
    }
    return ciphertext.toString('base64');
}

function otpDecrypt(ciphertext, key) {
    let cipherBuf;
    try {
        cipherBuf = Buffer.from(ciphertext, 'base64');
    } catch (e) {
        throw new Error('Invalid base64 ciphertext for OTP decryption');
    }
    const keyBuf = Buffer.from(key, 'utf8');
    if (cipherBuf.length > keyBuf.length) {
        throw new Error('For OTP, key length must be at least as long as the ciphertext');
    }
    let plaintext = Buffer.alloc(cipherBuf.length);

    for (let i = 0; i < cipherBuf.length; i++) {
        plaintext[i] = cipherBuf[i] ^ keyBuf[i % keyBuf.length];
    }
    return plaintext.toString('utf8');
}

// AES Encryption/Decryption
function encryptAES(plaintext, key, mode) {
    try {
        const keyBuf = Buffer.alloc(16);
        Buffer.from(key).copy(keyBuf);
        const iv = mode === 'ECB' ? null : crypto.randomBytes(16);
        const algo = `aes-128-${mode.toLowerCase()}`;
        const cipher = iv ? crypto.createCipheriv(algo, keyBuf, iv) : crypto.createCipheriv(algo, keyBuf, null);
        let encrypted = cipher.update(plaintext, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return `${mode}:${iv ? iv.toString('base64') : ''}:${encrypted}`;
    } catch (error) {
        throw new Error(`AES Encryption Error: ${error.message}`);
    }
}

function decryptAES(ciphertext, key, mode) {
    try {
        const keyBuf = Buffer.alloc(16);
        Buffer.from(key).copy(keyBuf);
        const [storedMode, ivBase64, encrypted] = ciphertext.split(':');
        if (storedMode !== mode) {
            throw new Error(`Mode mismatch: encrypted with ${storedMode}, attempted with ${mode}`);
        }
        const algo = `aes-128-${mode.toLowerCase()}`;
        const decipher = mode === 'ECB' 
            ? crypto.createDecipheriv(algo, keyBuf, null)
            : crypto.createDecipheriv(algo, keyBuf, Buffer.from(ivBase64, 'base64'));
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        throw new Error(`AES Decryption Error: ${error.message}`);
    }
}

// 3DES Encryption/Decryption
function encrypt3DES(plaintext, key, mode) {
    try {
        const keyBuf = Buffer.alloc(24);
        Buffer.from(key).copy(keyBuf);
        const iv = mode === 'ECB' ? null : crypto.randomBytes(8);
        const algo = `des-ede3-${mode.toLowerCase()}`;
        const cipher = iv ? crypto.createCipheriv(algo, keyBuf, iv) : crypto.createCipheriv(algo, keyBuf, null);
        let encrypted = cipher.update(plaintext, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return `${mode}:${iv ? iv.toString('base64') : ''}:${encrypted}`;
    } catch (error) {
        throw new Error(`3DES Encryption Error: ${error.message}`);
    }
}

function decrypt3DES(ciphertext, key, mode) {
    try {
        const keyBuf = Buffer.alloc(24);
        Buffer.from(key).copy(keyBuf);
        const [storedMode, ivBase64, encrypted] = ciphertext.split(':');
        if (storedMode !== mode) {
            throw new Error(`Mode mismatch: encrypted with ${storedMode}, attempted with ${mode}`);
        }
        const algo = `des-ede3-${mode.toLowerCase()}`;
        const decipher = mode === 'ECB' 
            ? crypto.createDecipheriv(algo, keyBuf, null)
            : crypto.createDecipheriv(algo, keyBuf, Buffer.from(ivBase64, 'base64'));
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        throw new Error(`3DES Decryption Error: ${error.message}`);
    }
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
});