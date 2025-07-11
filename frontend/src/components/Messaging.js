import React, { useState, useEffect } from 'react';
import axiosInstance, { API_ENDPOINTS } from '../utils/api';
import ClientCrypto from '../utils/crypto';
import CryptoDebugger from '../utils/cryptoDebugger';

function Messaging({ token }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugMode, setDebugMode] = useState(false);

  const privateKey = localStorage.getItem('privateKey');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.MESSAGE.LIST);
      setMessages(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch messages: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !recipient.trim() || !privateKey) {
      setError('Please enter a message, recipient, and ensure you are logged in');
      return;
    }

    setSending(true);
    setError('');
    setSuccess('');

    try {
      // Get recipient's public key
      const recipientRes = await axiosInstance.get(API_ENDPOINTS.AUTH.PUBLIC_KEY(recipient));
      const recipientPublicKey = recipientRes.data.data.publicKey;

      // Encrypt message with recipient's public key
      const encryptedMessage = ClientCrypto.encryptWithPublicKey(newMessage, recipientPublicKey);

      // Create digital signature
      const signature = ClientCrypto.createSignature(newMessage, privateKey);

      const res = await axiosInstance.post(API_ENDPOINTS.MESSAGE.SEND, {
        recipient,
        encryptedContent: encryptedMessage,
        signature,
        privateKey
      });

      setSuccess(`Message sent to ${recipient} successfully!`);
      setNewMessage('');
      setRecipient('');
      fetchMessages();
    } catch (err) {
      setError('Send failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axiosInstance.delete(API_ENDPOINTS.MESSAGE.DELETE(messageId));
      setSuccess('Message deleted successfully!');
      fetchMessages();
    } catch (err) {
      setError('Delete failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const decryptMessage = (message) => {
    try {
      if (!privateKey) {
        console.warn('🔑 No private key available for decryption');
        return '[Unable to decrypt - private key not available]';
      }

      if (!message || !message.encryptedContent) {
        console.warn('📦 No encrypted content in message');
        return '[Unable to decrypt - no encrypted content]';
      }

      console.log('🔓 Attempting to decrypt message from:', message.sender?.username || message.sender);
      console.log('Message ID:', message._id);
      console.log('Encrypted content length:', message.encryptedContent?.length);

      const decrypted = ClientCrypto.decryptWithPrivateKey(message.encryptedContent, privateKey);
      console.log('✅ Message decrypted successfully');
      return decrypted;
    } catch (err) {
      console.error('❌ Message decryption failed:', err);
      console.error('Error details:', {
        messageId: message._id,
        sender: message.sender?.username || message.sender,
        encryptedContentLength: message.encryptedContent?.length,
        errorMessage: err.message
      });

      // Provide more helpful error messages based on the error type
      if (err.message.includes('base64')) {
        return '[Unable to decrypt - corrupted message data]';
      } else if (err.message.includes('private key')) {
        return '[Unable to decrypt - invalid private key]';
      } else if (err.message.includes('Wrong key')) {
        return '[Unable to decrypt - message not intended for you]';
      } else {
        return `[Unable to decrypt - ${err.message}]`;
      }
    }
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    console.log('🔧 Running encryption diagnostics...');
    
    try {
      const results = await CryptoDebugger.diagnoseEncryptionIssues();
      
      if (results.issues.length === 0) {
        setSuccess('✅ Encryption diagnostics passed! Your system is working correctly.');
      } else {
        setError(`⚠️ Found ${results.issues.length} issue(s): ${results.issues.join(', ')}. Check console for details and recommendations.`);
      }
    } catch (err) {
      setError('Diagnostics failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const runQuickFix = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const fixes = await CryptoDebugger.quickFix();
      
      if (fixes.length > 0) {
        setSuccess(`🔧 Applied ${fixes.length} fix(es): ${fixes.join(', ')}. You may need to log in again.`);
      } else {
        setSuccess('ℹ️ No automatic fixes needed or available.');
      }
    } catch (err) {
      setError('Quick fix failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 text-shadow">Secure Messaging</h1>
            <p className="text-white/80 text-lg">Send and receive encrypted messages securely</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDebugMode(!debugMode)}
              className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              title="Toggle Debug Mode"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Debug Controls */}
        {debugMode && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-3">🔧 Encryption Debugging Tools</h3>
            <p className="text-white/70 text-sm mb-4">
              Use these tools if you're experiencing message decryption issues. Check the browser console for detailed information.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={runDiagnostics}
                disabled={loading}
                className="btn-secondary py-2 px-4 text-sm"
              >
                {loading ? '🔄 Running...' : '🔍 Run Diagnostics'}
              </button>
              <button
                onClick={runQuickFix}
                disabled={loading}
                className="btn-secondary py-2 px-4 text-sm"
              >
                {loading ? '🔄 Fixing...' : '🛠️ Quick Fix'}
              </button>
              <button
                onClick={() => {
                  console.clear();
                  console.log('🧹 Console cleared for debugging');
                }}
                className="btn-secondary py-2 px-4 text-sm"
              >
                🧹 Clear Console
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl animate-slide-up">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl animate-slide-up">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-200">{success}</p>
          </div>
        </div>
      )}

      {/* Send Message Form */}
      <div className="glass-card mb-8 hover:shadow-glow">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 animate-glow">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Send New Message</h2>
        </div>

        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-white/90 mb-2">
              Recipient Username
            </label>
            <input
              id="recipient"
              type="text"
              placeholder="Enter recipient's username"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input-field focus-ring"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-2">
              Message
            </label>
            <textarea
              id="message"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={4}
              className="input-field focus-ring resize-none"
              required
            />
            <p className="mt-2 text-xs text-white/60">
              Message will be encrypted end-to-end and digitally signed
            </p>
          </div>

          <button
            type="submit"
            disabled={sending || !newMessage.trim() || !recipient.trim()}
            className="btn-primary w-full py-3"
          >
            {sending ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Encrypting & Sending...
              </div>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </>
            )}
          </button>
        </form>
      </div>

      {/* Messages List */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 animate-pulse-soft">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Messages</h2>
          </div>
          <button
            onClick={fetchMessages}
            disabled={loading}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            title="Refresh"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <svg className="h-12 w-12 text-white/40 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-white/60">No messages yet</p>
            </div>
          ) : (
            messages.map((message) => {
              const isSentByUser = message.sender?.username === user.username || message.sender === user.username;
              const decryptedContent = decryptMessage(message);
              
              return (
                <div
                  key={message._id}
                  className={`relative p-4 rounded-lg border ${
                    isSentByUser
                      ? 'bg-blue-500/20 border-blue-400/30 ml-8'
                      : 'bg-white/5 border-white/20 mr-8'
                  } hover:bg-white/10 transition-all duration-200`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSentByUser ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        <span className="text-white text-sm font-medium">
                          {isSentByUser 
                            ? user.username?.charAt(0).toUpperCase() 
                            : (message.sender?.username || message.sender)?.charAt(0).toUpperCase()
                          }
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {isSentByUser ? 'You' : (message.sender?.username || message.sender)}
                        </p>
                        <p className="text-white/60 text-xs">
                          {formatDate(message.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {isSentByUser && (
                      <button
                        onClick={() => handleDeleteMessage(message._id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
                        title="Delete"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                      {decryptedContent}
                    </p>
                  </div>

                  {!isSentByUser && (
                    <div className="text-xs text-white/50">
                      <p>To: {message.recipient?.username || message.recipient}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-white/40 mt-2">
                    <div className="flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.018-4.118a3.508 3.508 0 00-4.95 0L5.36 15.49a3.508 3.508 0 004.95 4.95l5.708-5.707a3.508 3.508 0 000-4.95z" />
                      </svg>
                      <span>Encrypted</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Messaging;
