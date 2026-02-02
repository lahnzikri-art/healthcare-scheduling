# Security Guidelines

## 🔐 Security Best Practices

This project follows security best practices for microservice applications. Please read carefully before deploying to production.

---

## ⚠️ Critical Security Checklist

### Before Production Deployment:

- [ ] **Change all default passwords**
  - PostgreSQL password
  - JWT secret key (minimum 32 characters)
  
- [ ] **Use environment variables**
  - Never commit `.env` files
  - Use `.env.docker.example` as template
  
- [ ] **Enable HTTPS/TLS**
  - Use reverse proxy (nginx/traefik)
  - Get SSL certificate (Let's Encrypt)
  
- [ ] **Restrict database access**
  - Remove exposed ports (5433)
  - Use Docker network only
  
- [ ] **Implement rate limiting**
  - Add rate limiter middleware
  - Prevent brute-force attacks
  
- [ ] **Enable CORS properly**
  - Whitelist specific origins
  - Remove `origin: true` in production

---

## 🚨 What NOT to Commit

**NEVER commit these files:**

```
.env
.env.local
.env.docker
.env.production
*.pem
*.key
credentials.json
secrets.yaml
```

**Our .gitignore already blocks:**
- `.env*` files
- `node_modules/`
- `dist/`
- `*.log`

---

## 🔑 Environment Variables Security

### Development (Current)

```yaml
JWT_SECRET: dev-secret-key-change-in-production
POSTGRES_PASSWORD: postgres
```

⚠️ **These are DEFAULT VALUES for development only!**

### Production (Required Changes)

```bash
# Generate strong JWT secret (32+ characters)
JWT_SECRET=$(openssl rand -base64 32)

# Strong PostgreSQL password
POSTGRES_PASSWORD=$(openssl rand -base64 24)
```

**Example production .env.docker:**

```env
JWT_SECRET=7xK9mP2qR5tY8wZ1nV4bL6cE3fH0jG9sD2aW5xM8pQ1k
POSTGRES_PASSWORD=Xy7$mK2#pL9@nR4&vB6%tG3!fH8^jD1
POSTGRES_USER=healthcare_admin
```

---

## 🛡️ JWT Token Security

### Current Implementation:

- Algorithm: HS256 (HMAC with SHA-256)
- Expiry: 30 minutes
- Payload: `userId`, `email`

### Production Recommendations:

1. **Use RS256 (RSA)** for better security:
   ```bash
   # Generate RSA keypair
   openssl genrsa -out private.key 2048
   openssl rsa -in private.key -pubout -out public.key
   ```

2. **Reduce token expiry:**
   ```env
   JWT_EXPIRES_IN=15m  # Shorter lifespan
   ```

3. **Implement refresh tokens** for long-lived sessions

4. **Add token revocation** (Redis blacklist)

---

## 🔒 Password Security

### Current Implementation:

- **bcrypt** with 10 salt rounds
- Hashed before storage
- Never exposed in API responses

### Already Secure ✅

No additional changes needed for password hashing. bcrypt is industry-standard.

---

## 🌐 CORS Configuration

### Development (Permissive):

```typescript
app.enableCors({
  origin: true,  // Allows all origins
  credentials: true,
});
```

### Production (Restricted):

```typescript
app.enableCors({
  origin: ['https://yourdomain.com', 'https://app.yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST'],
});
```

---

## 🔐 Database Security

### Current Setup:

- PostgreSQL with default credentials
- Exposed port: 5433 → 5432

### Production Changes:

1. **Remove exposed ports** from docker-compose.yml:
   ```yaml
   postgres:
     # ports:
     #   - "5433:5432"  # REMOVE IN PRODUCTION
   ```

2. **Use Docker secrets:**
   ```yaml
   postgres:
     environment:
       POSTGRES_PASSWORD_FILE: /run/secrets/db_password
     secrets:
       - db_password
   ```

3. **Enable SSL/TLS** for database connections

4. **Implement connection pooling** with limits

---

## 🚦 Rate Limiting

**Not implemented** - Recommended for production:

```typescript
// Install: npm install @nestjs/throttler
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,      // 60 seconds
      limit: 10,    // 10 requests per ttl
    }),
  ],
})
```

---

## 📊 Audit Logging

### Current Implementation:

- Timestamps on all records (`createdAt`, `updatedAt`)
- No user action logging

### Production Recommendation:

Add audit trail:
```typescript
// Track who did what when
interface AuditLog {
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
}
```

---

## 🛠️ Security Headers

**Not implemented** - Add these headers in production:

```typescript
// Install: npm install helmet
import helmet from 'helmet';

app.use(helmet());  // Adds security headers
```

---

## 🔍 Dependency Security

### Regular Security Audits:

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (if possible)
npm audit fix

# Update dependencies
npm update
```

### Use Dependabot (GitHub):

Automatically creates PRs for dependency updates.

---

## 📋 Security Incident Response

If credentials are accidentally committed:

1. **Immediately rotate all secrets:**
   - Generate new JWT_SECRET
   - Change database passwords
   - Update all environment variables

2. **Remove from Git history:**
   ```bash
   # Use BFG Repo-Cleaner or git filter-branch
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Force push** (if not in production):
   ```bash
   git push origin --force --all
   ```

4. **Revoke all active JWT tokens** (if using token blacklist)

---

## ✅ Security Verification Checklist

Before deploying:

```bash
# 1. Check for committed secrets
git log --all -- '*.env'  # Should return empty

# 2. Verify .gitignore
cat .gitignore | grep .env  # Should show .env*

# 3. Audit npm packages
npm audit

# 4. Check environment variables
docker-compose config | grep -E "PASSWORD|SECRET"  # Review values

# 5. Test authentication
curl http://localhost:3002/graphql  # Should return 401 Unauthorized
```

---

## 🆘 Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Email: security@yourdomain.com (replace with actual email)
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [GraphQL Security](https://cheatsheetseries.owasp.org/cheatsheets/GraphQL_Cheat_Sheet.html)
- [Docker Security](https://docs.docker.com/engine/security/)

---

**Last Updated:** February 2, 2026

**Security Level:** Development (⚠️ NOT production-ready without changes above)
