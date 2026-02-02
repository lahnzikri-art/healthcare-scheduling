# Healthcare Scheduling System

Microservice untuk healthcare scheduling dengan NestJS + GraphQL + PostgreSQL.

## Services

- **Auth Service** (Port 3001): Autentikasi dan manajemen user
- **Schedule Service** (Port 3002): TBD

## Prerequisites

- Docker >= 24.x
- Docker Compose >= 2.x
- Node.js >= 20.x (untuk local development)

## Quick Start

1. **Clone & Setup**
   ```bash
   cd healthcare-scheduling
   ```

2. **Start Services**
   ```bash
   docker-compose up -d
   ```

3. **Access GraphQL Playground**
   - Auth Service: http://localhost:3001/graphql

## Environment Variables

### Auth Service

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@postgres:5432/auth_db` |
| `JWT_SECRET` | Secret key untuk JWT signing | `dev-secret-key-change-in-production` |
| `JWT_EXPIRES_IN` | Token expiry duration | `30m` |
| `PORT` | Service port | `3001` |

## GraphQL API Examples

### 1. Register User

```graphql
mutation {
  register(data: {
    email: "user@example.com"
    password: "password123"
  }) {
    accessToken
    user {
      id
      email
      createdAt
    }
  }
}
```

### 2. Login

```graphql
mutation {
  login(data: {
    email: "user@example.com"
    password: "password123"
  }) {
    accessToken
    user {
      id
      email
    }
  }
}
```

### 3. Validate Token

**Set HTTP Header:**
```json
{
  "Authorization": "Bearer <your-access-token>"
}
```

**Query:**
```graphql
query {
  validateToken {
    id
    email
    createdAt
    updatedAt
  }
}
```

## Development

### Local Development (without Docker)

1. **Install dependencies**
   ```bash
   cd auth-service
   npm install
   ```

2. **Setup database**
   ```bash
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16-alpine
   npx prisma migrate dev
   ```

3. **Start service**
   ```bash
   npm run start:dev
   ```

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name init

# Apply migrations (production)
npx prisma migrate deploy
```

## Architecture

```
┌─────────────────┐
│  GraphQL Client │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Service   │ Port 3001
│  (NestJS)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │ Port 5432
│   (auth_db)     │
└─────────────────┘
```

## Testing

TBD (Phase 2)

## License

MIT
