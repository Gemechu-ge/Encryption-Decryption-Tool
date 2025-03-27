async function encrypt() {
    const algorithm = document.getElementById('algorithm').value;
    const key = document.getElementById('encryptKey').value;
    const mode = document.getElementById('mode').value;
    const plaintext = document.getElementById('encryptText').value;
    const fileInput = document.getElementById('encryptFile');
    const formData = new FormData();

    if (algorithm === 'OTP' && plaintext.length > key.length) {
        alert('For OTP, the key must be at least as long as the text to encrypt.');
        return;
    }

    formData.append('algorithm', algorithm);
    formData.append('key', key);
    if (algorithm !== 'OTP') formData.append('mode', mode);
    if (plaintext) formData.append('plaintext', plaintext);
    if (fileInput.files[0]) formData.append('file', fileInput.files[0]);

    const response = await fetch('/encrypt', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    if (data.error) {
        alert(data.error);
    } else {
        document.getElementById('encryptResult').value = data.encrypted;
        if (data.filename) {
            document.getElementById('encryptResult').value += `\nFile: /uploads/${data.filename}`;
        }
    }
}

async function decrypt() {
    const algorithm = document.getElementById('algorithm').value;
    const key = document.getElementById('encryptKey').value;
    const mode = document.getElementById('mode').value;
    const ciphertext = document.getElementById('decryptText').value;
    const fileInput = document.getElementById('decryptFile');
    const formData = new FormData();

    // Only check key length against ciphertext length for OTP (server will handle base64 validation)
    if (algorithm === 'OTP' && ciphertext.length > key.length) {
        alert('For OTP, the key must be at least as long as the ciphertext.');
        return;
    }

    formData.append('algorithm', algorithm);
    formData.append('key', key);
    if (algorithm !== 'OTP') formData.append('mode', mode);
    if (ciphertext) formData.append('ciphertext', ciphertext);
    if (fileInput.files[0]) formData.append('file', fileInput.files[0]);

    const response = await fetch('/decrypt', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    if (data.error) {
        alert(data.error);
    } else {
        document.getElementById('decryptResult').value = data.decrypted;
        if (data.filename) {
            document.getElementById('decryptResult').value += `\nFile: /uploads/${data.filename}`;
        }
    }
}

function copyEncrypt() {
    const result = document.getElementById('encryptResult');
    result.select();
    document.execCommand('copy');
    alert('Encrypted text copied to clipboard!');
}

function copyDecrypt() {
    const result = document.getElementById('decryptResult');
    result.select();
    document.execCommand('copy');
    alert('Decrypted text copied to clipboard!');
}

function toggleMode() {
    const algorithm = document.getElementById('algorithm').value;
    const modeSelect = document.getElementById('mode');
    modeSelect.disabled = algorithm === 'OTP';
}