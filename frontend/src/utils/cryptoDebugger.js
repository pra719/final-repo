import ClientCrypto from './crypto';

class CryptoDebugger {
  /**
   * Comprehensive debugging for encryption/decryption issues
   */
  static async diagnoseEncryptionIssues() {
    console.log('🔧 Starting comprehensive encryption diagnosis...');
    
    const results = {
      keyGeneration: false,
      selfEncryption: false,
      crossEncryption: false,
      storageRetrieval: false,
      issues: [],
      recommendations: []
    };

    try {
      // Test 1: Key Generation
      console.log('\n📝 Test 1: Key Generation');
      const testKeys = ClientCrypto.generateKeyPair();
      if (testKeys.publicKey && testKeys.privateKey) {
        console.log('✅ Key generation successful');
        results.keyGeneration = true;
      } else {
        console.log('❌ Key generation failed');
        results.issues.push('Key generation failed');
      }

      // Test 2: Self Encryption/Decryption
      console.log('\n🔒 Test 2: Self Encryption/Decryption');
      const testMessage = 'Hello, this is a test message!';
      try {
        const encrypted = ClientCrypto.encryptWithPublicKey(testMessage, testKeys.publicKey);
        const decrypted = ClientCrypto.decryptWithPrivateKey(encrypted, testKeys.privateKey);
        
        if (decrypted === testMessage) {
          console.log('✅ Self encryption/decryption successful');
          results.selfEncryption = true;
        } else {
          console.log('❌ Message mismatch after encryption/decryption');
          console.log('Original:', testMessage);
          console.log('Decrypted:', decrypted);
          results.issues.push('Message mismatch in self encryption test');
        }
      } catch (error) {
        console.log('❌ Self encryption/decryption failed:', error.message);
        results.issues.push(`Self encryption failed: ${error.message}`);
      }

      // Test 3: Storage and Retrieval
      console.log('\n💾 Test 3: Local Storage Key Retrieval');
      const storedPrivateKey = localStorage.getItem('privateKey');
      const storedUser = localStorage.getItem('user');
      
      if (!storedPrivateKey) {
        console.log('⚠️ No private key found in localStorage');
        results.issues.push('No private key in localStorage');
        results.recommendations.push('Please log in again to generate/store your private key');
      } else {
        console.log('✅ Private key found in localStorage');
        console.log('Key length:', storedPrivateKey.length);
        
        // Validate stored key format
        if (ClientCrypto.isValidPEM(storedPrivateKey, 'PRIVATE KEY')) {
          console.log('✅ Stored private key format is valid');
          results.storageRetrieval = true;
        } else {
          console.log('❌ Stored private key format is invalid');
          results.issues.push('Invalid private key format in localStorage');
          results.recommendations.push('Clear localStorage and log in again');
        }
      }

      if (!storedUser) {
        console.log('⚠️ No user data found in localStorage');
        results.issues.push('No user data in localStorage');
      } else {
        console.log('✅ User data found:', JSON.parse(storedUser).username);
      }

      // Test 4: Cross-User Encryption Simulation
      console.log('\n👥 Test 4: Cross-User Encryption Simulation');
      try {
        const user1Keys = ClientCrypto.generateKeyPair();
        const user2Keys = ClientCrypto.generateKeyPair();
        
        const message = 'Cross-user test message';
        const encrypted = ClientCrypto.encryptWithPublicKey(message, user2Keys.publicKey);
        const decrypted = ClientCrypto.decryptWithPrivateKey(encrypted, user2Keys.privateKey);
        
        if (decrypted === message) {
          console.log('✅ Cross-user encryption simulation successful');
          results.crossEncryption = true;
        } else {
          console.log('❌ Cross-user encryption simulation failed');
          results.issues.push('Cross-user encryption test failed');
        }
      } catch (error) {
        console.log('❌ Cross-user encryption simulation error:', error.message);
        results.issues.push(`Cross-user encryption error: ${error.message}`);
      }

      // Generate recommendations
      if (results.issues.length === 0) {
        console.log('\n🎉 All tests passed! Your encryption setup appears to be working correctly.');
        results.recommendations.push('Your encryption system is functioning properly');
      } else {
        console.log('\n⚠️ Issues detected:');
        results.issues.forEach((issue, index) => {
          console.log(`${index + 1}. ${issue}`);
        });
      }

      console.log('\n💡 Recommendations:');
      results.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });

      return results;
    } catch (error) {
      console.error('❌ Diagnosis failed:', error);
      return {
        ...results,
        issues: [...results.issues, `Diagnosis failed: ${error.message}`]
      };
    }
  }

  /**
   * Quick fix for common encryption issues
   */
  static async quickFix() {
    console.log('🔧 Attempting quick fixes for common issues...');
    
    const fixes = [];

    // Fix 1: Clear corrupted localStorage data
    try {
      const privateKey = localStorage.getItem('privateKey');
      if (privateKey && !ClientCrypto.isValidPEM(privateKey, 'PRIVATE KEY')) {
        console.log('🧹 Clearing corrupted private key from localStorage');
        localStorage.removeItem('privateKey');
        localStorage.removeItem('user');
        fixes.push('Cleared corrupted keys from localStorage');
      }
    } catch (error) {
      console.log('Error checking localStorage:', error);
    }

    // Fix 2: Generate fresh keys if needed
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.username && !localStorage.getItem('privateKey')) {
        console.log('🔑 Generating fresh key pair');
        const newKeys = ClientCrypto.generateKeyPair();
        // Note: This should be done through proper login flow
        console.log('⚠️ Fresh keys generated, but you need to register them with the server');
        fixes.push('Generated fresh keys (requires re-registration)');
      }
    } catch (error) {
      console.log('Error generating fresh keys:', error);
    }

    if (fixes.length === 0) {
      console.log('ℹ️ No automatic fixes applied. Manual intervention may be required.');
      return ['No automatic fixes needed or available'];
    }

    console.log('✅ Applied fixes:', fixes);
    return fixes;
  }

  /**
   * Test specific message decryption
   */
  static testMessageDecryption(message) {
    console.log('🧪 Testing specific message decryption...');
    console.log('Message details:', {
      id: message._id,
      sender: message.sender?.username || message.sender,
      hasEncryptedContent: !!message.encryptedContent,
      encryptedLength: message.encryptedContent?.length
    });

    const privateKey = localStorage.getItem('privateKey');
    
    if (!privateKey) {
      console.log('❌ No private key available');
      return { success: false, error: 'No private key available' };
    }

    if (!ClientCrypto.isValidPEM(privateKey, 'PRIVATE KEY')) {
      console.log('❌ Invalid private key format');
      return { success: false, error: 'Invalid private key format' };
    }

    try {
      // Test if encrypted content is valid base64
      const testDecode = atob(message.encryptedContent);
      console.log('✅ Encrypted content is valid base64');
      
      // Attempt decryption
      const decrypted = ClientCrypto.decryptWithPrivateKey(message.encryptedContent, privateKey);
      console.log('✅ Message decrypted successfully:', decrypted);
      
      return { success: true, decrypted };
    } catch (error) {
      console.log('❌ Decryption failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate encryption compatibility between users
   */
  static async validateUserCompatibility(recipientUsername) {
    console.log(`🔍 Validating encryption compatibility with user: ${recipientUsername}`);
    
    try {
      // This would typically involve calling your API to get recipient's public key
      // For now, we'll just check if we can retrieve it
      console.log('⚠️ This test requires API integration to fetch recipient public key');
      return { success: false, error: 'API integration required for full compatibility test' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default CryptoDebugger;