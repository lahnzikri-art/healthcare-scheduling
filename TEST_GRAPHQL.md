# Auth Service GraphQL Testing Guide

**Service URL**: `http://localhost:3001/graphql`

## ✅ Correct GraphQL Request Format

### 1. Register User

**Request Body (JSON)**:
```json
{
  "query": "mutation { register(data: {email: \"test@example.com\", password: \"password123\"}) { accessToken user { id email createdAt } } }"
}
```

**Or formatted (sama aja)**:
```json
{
  "query": "mutation {\n  register(data: {\n    email: \"test@example.com\"\n    password: \"password123\"\n  }) {\n    accessToken\n    user {\n      id\n      email\n      createdAt\n    }\n  }\n}"
}
```

**Expected Response**:
```json
{
  "data": {
    "register": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "test@example.com",
        "createdAt": "2026-02-02T13:15:30.000Z"
      }
    }
  }
}
```

---

### 2. Login

**Request Body**:
```json
{
  "query": "mutation { login(data: {email: \"test@example.com\", password: \"password123\"}) { accessToken user { id email } } }"
}
```

**Expected Response**:
```json
{
  "data": {
    "login": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "test@example.com"
      }
    }
  }
}
```

---

### 3. Validate Token (Protected Query)

**Request Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body**:
```json
{
  "query": "query { validateToken { id email createdAt updatedAt } }"
}
```

**Expected Response**:
```json
{
  "data": {
    "validateToken": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "test@example.com",
      "createdAt": "2026-02-02T13:15:30.000Z",
      "updatedAt": "2026-02-02T13:15:30.000Z"
    }
  }
}
```

---

## ❌ Common Mistakes

### WRONG ❌
```json
{
  "query": "query { mutation { register(...) } }"
}
```
**Error**: `Cannot query field "mutation" on type "Query"`

### CORRECT ✅
```json
{
  "query": "mutation { register(...) { ... } }"
}
```

---

## 🧪 Testing Tools

### Altair GraphQL Client (Your current tool)
1. Set URL: `http://localhost:3001/graphql`
2. **Method**: POST (default)
3. **Headers**: `Content-Type: application/json`
4. Paste mutation in query panel (left side)
5. Click "Send Request"

### cURL Command Line
```bash
# Register
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { register(data: {email: \"curl@example.com\", password: \"password123\"}) { accessToken user { id email } } }"}'

# Login
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(data: {email: \"curl@example.com\", password: \"password123\"}) { accessToken user { id } } }"}'

# Validate (replace TOKEN with actual token from login/register)
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"query":"query { validateToken { id email } }"}'
```

---

## 🔍 Troubleshooting

**"Server cannot be reached"**
→ Check containers: `docker compose ps`
→ Restart: `docker compose restart auth-service`

**Empty response from curl**
→ Use Altair/Postman instead (curl has buffering issues with Apollo)

**CSRF error**
→ Already disabled (`csrfPrevention: false` in app.module.ts)

**401 Unauthorized on validateToken**
→ Check JWT token in Authorization header
→ Token expires after 30 minutes

**Email already registered**
→ Use different email or check database: 
```bash
docker compose exec postgres psql -U postgres -d auth_db -c "SELECT * FROM users;"
```
