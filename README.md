# 🔐 Secure File Sharing Application

A modern, secure file sharing platform with end-to-end encryption, digital signatures, and PKI-based authentication.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd secure-file-sharing
   ```

2. **Start the application**
   ```bash
   chmod +x restart.sh
   ./restart.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - MongoDB: localhost:27017

## 🔧 Fixed Issues

### Critical Fixes Applied:

1. **Authentication Signature Error** ✅
   - **Issue**: "Encrypted message length is invalid" error during login
   - **Root Cause**: Mismatch between frontend (hex) and backend (base64) signature formats
   - **Fix**: Standardized to base64 format with fallback handling for both formats

2. **Duplicate Import Error** ✅
   - **Issue**: Duplicate `express-rate-limit` imports in auth.js
   - **Fix**: Removed duplicate import statement

3. **Signature Verification Logic** ✅
   - **Issue**: Incorrect signature verification approach using decrypt instead of verify
   - **Fix**: Implemented proper signature verification with multiple format support

4. **Backend Crypto Compatibility** ✅
   - **Issue**: Inconsistent signature creation and verification methods
   - **Fix**: Unified crypto operations to use base64 encoding consistently

## 🏗️ Architecture

### Backend (`/backend`)
- **Framework**: Express.js with security middleware
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: PKI-based with digital signatures
- **Encryption**: RSA + AES hybrid encryption
- **Certificate Authority**: Self-signed CA for user certificates

### Frontend (`/frontend`)
- **Framework**: React with React Router
- **Styling**: Tailwind CSS with custom components
- **Crypto**: Node-forge for client-side cryptography
- **State Management**: React hooks and localStorage

### Database Models
- **Users**: Username, email, public key, certificate data
- **Files**: Encrypted file metadata and sharing permissions
- **Messages**: End-to-end encrypted messaging

## 🔐 Security Features

### PKI Implementation
- Self-signed Certificate Authority (CA)
- Individual user certificates
- Digital signature authentication
- Certificate validation and revocation support

### Encryption
- **RSA-2048** for asymmetric operations
- **AES-256-CBC** for symmetric file encryption
- **SHA-256** for hashing and digital signatures
- **HMAC** for data integrity verification

### Security Headers
- CORS configuration
- Helmet.js security headers
- Rate limiting protection
- Input validation and sanitization

## 📝 Usage Guide

### Registration
1. Navigate to registration page
2. Enter username and email
3. System generates RSA key pair and certificate
4. **Download and securely store your private key**

### Login
1. Enter your username
2. Upload your private key file (.pem)
3. System creates challenge-response authentication
4. Digital signature verification grants access

### File Sharing
1. Upload files (automatically encrypted)
2. Share with other users by username
3. Recipients can decrypt using their private keys
4. View shared files in secure file manager

### Messaging
1. Send encrypted messages to other users
2. Messages encrypted with recipient's public key
3. Real-time message updates
4. Message history and management

## 🛠️ Development

### Local Development Setup

1. **Backend Development**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **MongoDB**
   ```bash
   docker run -d -p 27017:27017 mongo:5.0
   ```

### Environment Variables

**Backend** (`.env`):
```env
MONGO_URI=mongodb://localhost:27017/secure_app
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`.env`):
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🧪 Testing

### Backend API Testing
```bash
# Test connectivity
curl http://localhost:5000/api/test

# Test authentication challenge
curl -X POST http://localhost:5000/api/auth/challenge

# Check health status
curl http://localhost:5000/health
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Monitoring & Logs

### View Application Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

### Health Check Endpoints
- Backend: `GET /health`
- Test API: `GET /api/test`

## 🔍 Troubleshooting

### Common Issues

1. **Login Fails with Signature Error**
   - Ensure you're using the correct private key file
   - Verify file format (.pem with proper headers)
   - Check backend logs for detailed error messages

2. **Backend Connection Error**
   - Verify Docker services are running: `docker-compose ps`
   - Check MongoDB connection: `docker-compose logs mongo`
   - Test backend directly: `curl http://localhost:5000/api/test`

3. **Frontend Not Loading**
   - Clear browser cache and local storage
   - Check frontend logs: `docker-compose logs frontend`
   - Verify environment variables are set correctly

4. **File Upload/Download Issues**
   - Check available disk space
   - Verify file permissions in Docker volumes
   - Monitor backend logs during file operations

### Performance Optimization
- MongoDB indexes are configured for efficient queries
- Rate limiting prevents abuse
- File encryption uses streaming for large files
- Certificate caching reduces verification overhead

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🛡️ Security Notice

This application implements cryptographic security measures for educational and demonstration purposes. For production use:

- Use proper certificate authority
- Implement additional security auditing
- Use hardware security modules (HSM) for key storage
- Regular security assessments and updates
- Proper key rotation policies

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review application logs
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for secure communication and file sharing**