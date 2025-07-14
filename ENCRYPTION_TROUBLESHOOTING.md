# Encryption/Decryption Troubleshooting Guide

## Common Issues and Solutions

### Issue: "[Unable to decrypt - invalid key or corrupted message]"

This error occurs when the system cannot decrypt a received message. Here are the most common causes and solutions:

#### **1. Key Mismatch Problem**
**Cause:** The message was encrypted with a different public key than your corresponding private key.

**Solutions:**
- **Log out and log back in** to refresh your keys
- Check if the sender has your correct public key
- Verify you're using the right account

#### **2. Corrupted Private Key**
**Cause:** Your private key in localStorage is corrupted or invalid.

**Solutions:**
1. **Clear browser data:**
   ```javascript
   localStorage.removeItem('privateKey');
   localStorage.removeItem('user');
   ```
2. **Log in again** to generate fresh keys
3. **Clear browser cache** and cookies

#### **3. Base64 Encoding Issues**
**Cause:** The encrypted message data is not properly encoded.

**Solutions:**
- Ask the sender to resend the message
- Check network connectivity during message transmission
- Verify the message wasn't corrupted during storage/transmission

#### **4. Different Encryption Algorithms**
**Cause:** Sender and receiver are using different encryption methods.

**Solutions:**
- Ensure both parties are using the same version of the application
- Update to the latest version
- Check that both users have compatible encryption libraries

---

## Step-by-Step Troubleshooting

### Step 1: Use Built-in Diagnostics
1. Go to the **Messaging** page
2. Click the **⚙️ Debug** button (top right)
3. Click **🔍 Run Diagnostics**
4. Check the console for detailed results
5. Follow the recommendations provided

### Step 2: Quick Fix Attempt
1. In Debug Mode, click **🛠️ Quick Fix**
2. This will automatically:
   - Clear corrupted keys
   - Validate key formats
   - Generate fresh keys if needed

### Step 3: Manual Key Reset
If automatic fixes don't work:

1. **Clear all authentication data:**
   ```javascript
   localStorage.clear();
   ```

2. **Close and reopen your browser**

3. **Log in again** with your credentials

4. **Test encryption** by sending a message to yourself

### Step 4: Verify System Compatibility
1. **Check browser compatibility:**
   - Chrome 70+
   - Firefox 65+
   - Safari 12+
   - Edge 79+

2. **Enable JavaScript** (required for encryption)

3. **Disable browser extensions** that might interfere with cryptography

---

## Advanced Debugging

### Console Commands
Open your browser's developer console (F12) and run these commands:

#### Test Key Generation
```javascript
import('./src/utils/crypto.js').then(crypto => {
  const keys = crypto.default.generateKeyPair();
  console.log('Key generation test:', keys.publicKey ? 'PASS' : 'FAIL');
});
```

#### Test Self-Encryption
```javascript
import('./src/utils/cryptoDebugger.js').then(debugger => {
  debugger.default.diagnoseEncryptionIssues();
});
```

#### Check Stored Keys
```javascript
const privateKey = localStorage.getItem('privateKey');
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('Private key exists:', !!privateKey);
console.log('User data:', user);
```

### Network-Related Issues

#### **Problem:** Messages fail to encrypt/decrypt over network
**Solutions:**
1. Check internet connection stability
2. Verify server is responding correctly
3. Check for proxy/firewall interference
4. Try from a different network

#### **Problem:** Public key retrieval fails
**Solutions:**
1. Verify the recipient username is correct
2. Ensure the recipient has registered and logged in at least once
3. Check server connectivity
4. Try refreshing the page

---

## Prevention Best Practices

### 1. Regular Key Maintenance
- Log out and log back in weekly to refresh keys
- Don't manually edit localStorage data
- Keep your browser updated

### 2. Secure Environment
- Use encryption only on trusted devices
- Don't share your private key with anyone
- Log out from shared computers

### 3. Error Reporting
When reporting encryption issues, include:
- Browser and version
- Console error messages
- Steps to reproduce
- Whether it affects all messages or specific ones

---

## Emergency Recovery

### Complete System Reset
If nothing else works:

1. **Export important data** (if possible)
2. **Clear all browser data:**
   - History
   - Cookies
   - LocalStorage
   - Cache
3. **Restart browser**
4. **Re-register** your account
5. **Import data** if previously exported

### Contact Support
If issues persist after following this guide:

1. **Enable Debug Mode** and run diagnostics
2. **Copy console output** (screenshots or text)
3. **Note your browser version** and operating system
4. **Describe the exact steps** that lead to the error
5. **Contact technical support** with all gathered information

---

## Technical Details

### Encryption Specifications
- **Algorithm:** RSA-OAEP with 2048-bit keys
- **Fallback:** PKCS#1 v1.5 padding
- **Hash Function:** SHA-256
- **Key Format:** PEM encoding
- **Message Format:** Base64 encoded ciphertext

### Security Notes
- Private keys never leave your device
- Messages are encrypted end-to-end
- No plaintext is stored on servers
- Perfect forward secrecy through key rotation

### Browser Requirements
- WebCrypto API support
- LocalStorage enabled
- JavaScript enabled
- Modern ES6+ support

---

## Frequently Asked Questions

**Q: Why do I need to log in again after clearing data?**
A: Your private key is stored locally for security. Clearing data removes it, requiring re-authentication.

**Q: Can I recover old messages after a key reset?**
A: No, messages encrypted with old keys cannot be decrypted with new keys. This is by design for security.

**Q: Is my private key sent to the server?**
A: No, your private key remains on your device. Only your public key is shared with the server.

**Q: What happens if I lose my private key?**
A: You'll need to register a new key pair. Old messages will be unrecoverable.

**Q: Can I use the same account on multiple devices?**
A: Each device generates its own key pair. Messages are device-specific for security reasons.

---

*Last updated: [Current Date]*
*Version: 1.0*