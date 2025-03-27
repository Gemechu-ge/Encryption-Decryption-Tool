# Encryption/Decryption Web App

This is a web application that allows users to encrypt and decrypt messages using three different algorithms: One-Time Pad (OTP), 3DES, and AES. The app supports multiple cipher block modes for 3DES and AES, file uploads for processing text files, and a user-friendly interface to display encrypted and decrypted results.

## Features
- **Encryption Algorithms**:
  - One-Time Pad (OTP): Custom XOR-based implementation with a randomly generated key.
  - 3DES: Uses the Node.js `crypto` module with support for ECB, CBC, and CFB modes (CTR falls back to ECB).
  - AES: Uses the Node.js `crypto` module with support for ECB, CBC, CFB, and CTR modes.
- **Cipher Block Modes**:
  - Selectable modes for 3DES and AES: Electronic Codebook (ECB), Cipher Block Chaining (CBC), Cipher Feedback (CFB), and Counter (CTR).
- **File Upload Support**:
  - Upload `.txt` files to encrypt or decrypt their contents.
- **User Interface**:
  - Side-by-side sections for encryption and decryption.
  - Input fields for messages and keys.
  - Output fields to display encrypted cipher text and decrypted normal text.
  - Buttons to encrypt, decrypt, and copy results to the clipboard.
  - Dropdowns to choose the algorithm and block mode.
- **GitHub Compatibility**:
  - Includes a `.gitignore` file to exclude `node_modules` and `uploads`.
  - Uses a `.gitattributes` file to enforce LF line endings for cross-platform consistency.

## Prerequisites
- **Node.js**: Version 14 or higher.
- **npm**: Node package manager (comes with Node.js).
- **Git**: For cloning the repository and managing version control.

## Installation
1. **Clone the Repository**:
   ```
   git clone https://github.com/Gemechu-ge/Encryption-Decryption-Tool-.git
   
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```
   This installs the required packages (`express` and `multer`) listed in `package.json`.

3. **Start the Server**:
   ```
   node server.js
   ```
   The app will run on `http://localhost:3000`.

## Usage
1. **Open the App**:
   - Open your browser and navigate to `http://localhost:3000`.

2. **Encrypt a Message**:
   - In the "Message to Encrypt" section, enter your plaintext or upload a `.txt` file.
   - Provide an encryption key in the "Encryption Key" field.
   - Select an algorithm (OTP, 3DES, or AES) and a block mode (ECB, CBC, CFB, or CTR) from the dropdowns.
   - Click the "Encrypt" button.
   - The encrypted cipher text will appear in the "Encrypted Cipher Text" field 
3. **Decrypt a Message**:
   - In the "Message to Decrypt" section, enter your cipher text or upload a `.txt` file.
   - Provide the decryption key in the "Decryption Key" field (this should match the key used for encryption).
   - Ensure the same algorithm and block mode are selected.
   - Click the "Decrypt" button.
   - The decrypted normal text will appear in the "Decrypted Normal Text" field 
4. **Copy Results**:
   - Use the "Copy Encryption" button to copy the encrypted text to your clipboard.
   - Use the "Copy Decryption" button to copy the decrypted text to your clipboard.

## Project Structure
```
encryption-app/
├── node_modules/           # Excluded by .gitignore
├── uploads/               # Excluded by .gitignore (temporary file storage)
├── public/
│   ├── index.html         # Frontend HTML
│   ├── styles.css         # CSS for styling
│   ├── script.js          # JavaScript for frontend logic
├── server.js              # Backend server with encryption/decryption logic
├── .gitignore             # Git ignore file
├── .gitattributes         # Enforces LF line endings
├── README.md              # Project documentation
├── package.json           # Node.js dependencies and scripts
```

## Dependencies
- **express**: Web framework for Node.js to handle HTTP requests.
- **multer**: Middleware for handling file uploads.
- **crypto**: Built-in Node.js module for encryption and decryption (used for 3DES and AES).

