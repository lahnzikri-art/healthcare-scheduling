# Healthcare Scheduling System

Microservice-based healthcare scheduling system built with NestJS, GraphQL, PostgreSQL, and Docker.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Services](#services)
- [Environment Variables](#environment-variables)
- [GraphQL API Examples](#graphql-api-examples)
- [Testing](#testing)
- [Development](#development)
- [Project Structure](#project-structure)
- [License](#license)

---

## 🎯 Overview

Healthcare Scheduling System enables clinics to manage consultation schedules between doctors and customers. The system consists of 2 independent microservices:

1. **Auth Service** - User authentication and JWT token management
2. **Schedule Service** - Customer, Doctor, and Schedule management

### Key Features

✅ **Authentication**
- User registration with bcrypt password hashing
- JWT-based authentication
- Token validation for inter-service communication

✅ **Customer Management**
- CRUD operations with pagination
- Email uniqueness validation
- Full GraphQL API

✅ **Doctor Management**
- CRUD operations with pagination
- Full GraphQL API

✅ **Schedule Management**
- Create/Read/Delete schedules
- **Double-booking prevention** (same doctor cannot have 2 schedules at same time)
- Foreign key validation (Customer & Doctor must exist)
- Filter by customerId or doctorId
- Pagination support

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Client Layer                           │
│                   (GraphQL Playground / Postman)              │
└────────────┬─────────────────────────────────┬───────────────┘
             │                                 │
             ▼                                 ▼
┌─────────────────────────┐       ┌─────────────────────────────┐
│    Auth Service         │       │   Schedule Service          │
│    Port: 3001           │       │   Port: 3002                │
│    ┌─────────────┐      │       │   ┌──────────────────┐      │
│    │ GraphQL API │      │       │   │  GraphQL API     │      │
│    │  - register │      │       │   │  - Customer CRUD │      │
│    │  - login    │      │       │   │  - Doctor CRUD   │      │
│    │  - validate │      │       │   │  - Schedule CRUD │      │
│    └──────┬──────┘      │       │   └────────┬─────────┘      │
│           │             │       │            │                │
│    ┌──────▼──────┐      │       │   ┌────────▼──────────┐     │
│    │  JWT Auth   │      │◄──────┼───│  JWT Validation   │     │
│    │  (bcrypt)   │      │       │   │  (Guards)         │     │
│    └──────┬──────┘      │       │   └────────┬──────────┘     │
│           │             │       │            │                │
│    ┌──────▼──────┐      │       │   ┌────────▼──────────┐     │
│    │   Prisma    │      │       │   │     Prisma        │     │
│    └──────┬──────┘      │       │   └────────┬──────────┘     │
└───────────┼─────────────┘       └────────────┼────────────────┘
            │                                  │
            ▼                                  ▼
┌───────────────────────┐       ┌─────────────────────────────┐
│   PostgreSQL          │       │   PostgreSQL                │
│   Database: auth_db   │       │   Database: schedule_db     │
│   ┌─────────────┐     │       │   ┌──────────────────────┐  │
│   │   users     │     │       │   │   customers          │  │
│   └─────────────┘     │       │   │   doctors            │  │
│                       │       │   │   schedules          │  │
│   Port: 5432          │       │   └──────────────────────┘  │
└───────────────────────┘       │   Port: 5432                │
                                └─────────────────────────────┘
            │                                  │
            └──────────┬───────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │   Docker Network     │
            │  healthcare-network  │
            └──────────────────────┘
```

### Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | NestJS (TypeScript) |
| API | GraphQL (Apollo Server) |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Authentication | JWT + bcrypt |
| Container | Docker + Docker Compose |
| Validation | class-validator |

---

## 📦 Prerequisites

- **Docker** >= 24.x
- **Docker Compose** >= 2.x
- **Node.js** >= 20.x (for local development only)
- **Git**

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/lahnzikri-art/healthcare-scheduling.git
cd healthcare-scheduling
```

### 2. Start All Services

```bash
docker compose up --build -d
```

This will start:
- PostgreSQL container (port 5433 → 5432)
- Auth Service (port 3001)
- Schedule Service (port 3002)

### 3. Create Schedule Database

```bash
docker exec healthcare-postgres psql -U postgres -c "CREATE DATABASE schedule_db;"
```

### 4. Run Migrations

```bash
# Auth Service migration
docker exec healthcare-auth npx prisma migrate deploy

# Schedule Service migration
docker exec healthcare-schedule npx prisma migrate deploy
```

### 5. Access GraphQL Playgrounds

- **Auth Service:** http://localhost:3001/graphql
- **Schedule Service:** http://localhost:3002/graphql

### 6. Test the System

See [GraphQL API Examples](#graphql-api-examples) section below.

---

## 🔧 Services

### Auth Service (Port 3001)

**Responsibilities:**
- User registration
- User login
- JWT token generation
- Token validation

**Endpoints:**
- `register` (Mutation) - Create new user
- `login` (Mutation) - Authenticate and get JWT token
- `validateToken` (Query) - Validate JWT token

**Database:** `auth_db`
- `users` table (id, email, password, createdAt, updatedAt)

---

### Schedule Service (Port 3002)

**Responsibilities:**
- Customer management
- Doctor management
- Schedule management with business rules

**Customer Endpoints:**
- `createCustomer` (Mutation)
- `updateCustomer` (Mutation)
- `deleteCustomer` (Mutation)
- `customers` (Query) - List with pagination
- `customer` (Query) - Get by ID

**Doctor Endpoints:**
- `createDoctor` (Mutation)
- `updateDoctor` (Mutation)
- `deleteDoctor` (Mutation)
- `doctors` (Query) - List with pagination
- `doctor` (Query) - Get by ID

**Schedule Endpoints:**
- `createSchedule` (Mutation) - With double-booking validation
- `deleteSchedule` (Mutation)
- `schedules` (Query) - List with filter & pagination
- `schedule` (Query) - Get by ID

**Database:** `schedule_db`
- `customers` table (id, name, email, createdAt, updatedAt)
- `doctors` table (id, name, createdAt, updatedAt)
- `schedules` table (id, objective, customerId, doctorId, scheduledAt, createdAt, updatedAt)

**Business Rules:**
- ❌ No double-booking: Same doctor cannot have 2 schedules at same time
- ✅ Customer must exist in database
- ✅ Doctor must exist in database

---

## 🔐 Environment Variables

### Auth Service

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@postgres:5432/auth_db` |
| `JWT_SECRET` | Secret key for JWT signing | `dev-secret-key-change-in-production` |
| `JWT_EXPIRES_IN` | Token expiration duration | `30m` |
| `PORT` | Service port | `3001` |

### Schedule Service

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@postgres:5432/schedule_db` |
| `JWT_SECRET` | Secret key for JWT validation (must match auth-service) | `dev-secret-key-change-in-production` |
| `JWT_EXPIRES_IN` | Token expiration duration | `30m` |
| `PORT` | Service port | `3002` |

### PostgreSQL

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `POSTGRES_USER` | Database username | `postgres` |
| `POSTGRES_PASSWORD` | Database password | `postgres` |
| `POSTGRES_DB` | Default database | `auth_db` |

---

## 📝 GraphQL API Examples

### Authentication Flow

#### 1. Register User

```graphql
mutation {
  register(data: {
    email: "john@example.com"
    password: "securepassword123"
  }) {
    accessToken
    user {
      id
      email
      createdAt
      updatedAt
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "register": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "a26065f5-b6f1-421a-b128-b4e2121ebf43",
        "email": "john@example.com",
        "createdAt": "2026-02-02T16:15:56.000Z",
        "updatedAt": "2026-02-02T16:15:56.000Z"
      }
    }
  }
}
```

#### 2. Login

```graphql
mutation {
  login(data: {
    email: "john@example.com"
    password: "securepassword123"
  }) {
    accessToken
    user {
      id
      email
    }
  }
}
```

#### 3. Validate Token

**HTTP Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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

---

### Customer Management

**⚠️ All endpoints require JWT authentication (set Authorization header)**

#### Create Customer

```graphql
mutation {
  createCustomer(input: {
    name: "Jane Smith"
    email: "jane@example.com"
  }) {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

**Response:**
```json
{
  "data": {
    "createCustomer": {
      "id": "2c4218d6-7eca-4b1f-b23e-55ee472c6bfa",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2026-02-02T16:16:40.000Z",
      "updatedAt": "2026-02-02T16:16:40.000Z"
    }
  }
}
```

#### Update Customer

```graphql
mutation {
  updateCustomer(
    id: "2c4218d6-7eca-4b1f-b23e-55ee472c6bfa"
    input: {
      name: "Jane Doe"
      email: "jane.doe@example.com"
    }
  ) {
    id
    name
    email
  }
}
```

#### List Customers (with Pagination)

```graphql
query {
  customers(skip: 0, take: 10) {
    id
    name
    email
    createdAt
  }
}
```

#### Get Customer by ID

```graphql
query {
  customer(id: "2c4218d6-7eca-4b1f-b23e-55ee472c6bfa") {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

#### Delete Customer

```graphql
mutation {
  deleteCustomer(id: "2c4218d6-7eca-4b1f-b23e-55ee472c6bfa")
}
```

---

### Doctor Management

#### Create Doctor

```graphql
mutation {
  createDoctor(input: {
    name: "Dr. Michael Johnson"
  }) {
    id
    name
    createdAt
    updatedAt
  }
}
```

**Response:**
```json
{
  "data": {
    "createDoctor": {
      "id": "f71aee95-1d01-4d8f-9a28-a73b524b87ef",
      "name": "Dr. Michael Johnson",
      "createdAt": "2026-02-02T16:17:20.000Z",
      "updatedAt": "2026-02-02T16:17:20.000Z"
    }
  }
}
```

#### Update Doctor

```graphql
mutation {
  updateDoctor(
    id: "f71aee95-1d01-4d8f-9a28-a73b524b87ef"
    input: {
      name: "Dr. Michael J. Johnson Sr."
    }
  ) {
    id
    name
  }
}
```

#### List Doctors (with Pagination)

```graphql
query {
  doctors(skip: 0, take: 10) {
    id
    name
    createdAt
  }
}
```

#### Get Doctor by ID

```graphql
query {
  doctor(id: "f71aee95-1d01-4d8f-9a28-a73b524b87ef") {
    id
    name
    createdAt
    updatedAt
  }
}
```

#### Delete Doctor

```graphql
mutation {
  deleteDoctor(id: "f71aee95-1d01-4d8f-9a28-a73b524b87ef")
}
```

---

### Schedule Management

#### Create Schedule

```graphql
mutation {
  createSchedule(input: {
    objective: "Annual physical checkup"
    customerId: "2c4218d6-7eca-4b1f-b23e-55ee472c6bfa"
    doctorId: "f71aee95-1d01-4d8f-9a28-a73b524b87ef"
    scheduledAt: "2026-03-15T10:00:00Z"
  }) {
    id
    objective
    scheduledAt
    customer {
      name
      email
    }
    doctor {
      name
    }
    createdAt
  }
}
```

**Response:**
```json
{
  "data": {
    "createSchedule": {
      "id": "8b3f7c92-4a12-4d8e-9f3a-6c2b1e5d8a7f",
      "objective": "Annual physical checkup",
      "scheduledAt": "2026-03-15T10:00:00.000Z",
      "customer": {
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "doctor": {
        "name": "Dr. Michael Johnson"
      },
      "createdAt": "2026-02-02T16:18:45.000Z"
    }
  }
}
```

#### List Schedules (All)

```graphql
query {
  schedules {
    id
    objective
    scheduledAt
    customer {
      name
      email
    }
    doctor {
      name
    }
  }
}
```

#### Filter Schedules by Customer

```graphql
query {
  schedules(
    filter: {
      customerId: "2c4218d6-7eca-4b1f-b23e-55ee472c6bfa"
    }
  ) {
    id
    objective
    scheduledAt
    doctor {
      name
    }
  }
}
```

#### Filter Schedules by Doctor

```graphql
query {
  schedules(
    filter: {
      doctorId: "f71aee95-1d01-4d8f-9a28-a73b524b87ef"
    }
  ) {
    id
    objective
    scheduledAt
    customer {
      name
      email
    }
  }
}
```

#### List Schedules with Pagination

```graphql
query {
  schedules(skip: 0, take: 10) {
    id
    objective
    scheduledAt
  }
}
```

#### Get Schedule by ID

```graphql
query {
  schedule(id: "8b3f7c92-4a12-4d8e-9f3a-6c2b1e5d8a7f") {
    id
    objective
    scheduledAt
    customer {
      id
      name
      email
    }
    doctor {
      id
      name
    }
    createdAt
    updatedAt
  }
}
```

#### Delete Schedule

```graphql
mutation {
  deleteSchedule(id: "8b3f7c92-4a12-4d8e-9f3a-6c2b1e5d8a7f")
}
```

---

### Error Handling Examples

#### Double-Booking Prevention

**Attempt to create duplicate schedule (same doctor + same time):**

```graphql
mutation {
  createSchedule(input: {
    objective: "Another checkup"
    customerId: "2c4218d6-7eca-4b1f-b23e-55ee472c6bfa"
    doctorId: "f71aee95-1d01-4d8f-9a28-a73b524b87ef"
    scheduledAt: "2026-03-15T10:00:00Z"  # Same time as existing schedule
  }) {
    id
  }
}
```

**Response (409 Conflict):**
```json
{
  "errors": [
    {
      "message": "Doctor already has a schedule at this time",
      "extensions": {
        "code": "CONFLICT",
        "statusCode": 409
      }
    }
  ]
}
```

#### Invalid Customer ID

```graphql
mutation {
  createSchedule(input: {
    objective: "Test"
    customerId: "00000000-0000-0000-0000-000000000000"
    doctorId: "f71aee95-1d01-4d8f-9a28-a73b524b87ef"
    scheduledAt: "2026-03-15T11:00:00Z"
  }) {
    id
  }
}
```

**Response (404 Not Found):**
```json
{
  "errors": [
    {
      "message": "Customer not found",
      "extensions": {
        "code": "NOT_FOUND",
        "statusCode": 404
      }
    }
  ]
}
```

#### Unauthorized Request (Missing JWT)

```graphql
query {
  customers {
    id
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "statusCode": 401
      }
    }
  ]
}
```

---

## 🧪 Testing

### Using GraphQL Playground

1. **Start services:**
   ```bash
   docker compose up -d
   ```

2. **Register a user** at http://localhost:3001/graphql
3. **Copy the accessToken** from response
4. **Go to Schedule Service** at http://localhost:3002/graphql
5. **Set HTTP Headers:**
   ```json
   {
     "Authorization": "Bearer <your-access-token>"
   }
   ```
6. **Test CRUD operations** using examples above

### Using cURL

```bash
# 1. Register user
TOKEN=$(curl -s http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation{register(data:{email:\"test@test.com\",password:\"pass123\"}){accessToken}}"}' \
  | jq -r '.data.register.accessToken')

# 2. Create customer
curl -s http://localhost:3002/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query":"mutation{createCustomer(input:{name:\"John Doe\",email:\"john@test.com\"}){id name email}}"}' \
  | jq '.'
```

### Verification Checklist

- [ ] Auth Service - Register user
- [ ] Auth Service - Login user
- [ ] Auth Service - Validate token
- [ ] Schedule Service - Create customer
- [ ] Schedule Service - Create doctor
- [ ] Schedule Service - Create schedule
- [ ] Schedule Service - Double-booking validation (should fail)
- [ ] Schedule Service - Invalid customer ID (should fail)
- [ ] Schedule Service - Unauthorized access (should fail)
- [ ] Schedule Service - Filter schedules by customerId
- [ ] Schedule Service - Filter schedules by doctorId
- [ ] Schedule Service - Pagination

---

## 💻 Development

### Local Development (without Docker)

#### Auth Service

```bash
# 1. Navigate to service
cd auth-service

# 2. Install dependencies
npm install

# 3. Setup .env file
cat > .env << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/auth_db"
JWT_SECRET="dev-secret-key-change-in-production"
JWT_EXPIRES_IN="30m"
PORT=3001
EOF

# 4. Run PostgreSQL (if not using Docker)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16-alpine

# 5. Run migrations
npx prisma migrate dev

# 6. Start development server
npm run start:dev
```

#### Schedule Service

```bash
# 1. Navigate to service
cd schedule-service

# 2. Install dependencies
npm install

# 3. Setup .env file
cat > .env << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/schedule_db"
JWT_SECRET="dev-secret-key-change-in-production"
JWT_EXPIRES_IN="30m"
PORT=3002
EOF

# 4. Create schedule_db database
docker exec -it <postgres-container-id> psql -U postgres -c "CREATE DATABASE schedule_db;"

# 5. Run migrations
npx prisma migrate dev

# 6. Start development server
npm run start:dev
```

### Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Docker Commands

```bash
# Start all services
docker compose up -d

# Start with rebuild
docker compose up --build -d

# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v

# View logs
docker logs healthcare-auth -f
docker logs healthcare-schedule -f
docker logs healthcare-postgres -f

# Execute command in container
docker exec -it healthcare-auth sh
docker exec -it healthcare-schedule sh

# Check running containers
docker ps

# Restart specific service
docker compose restart auth-service
```

---

## 📁 Project Structure

```
healthcare-scheduling/
├── auth-service/
│   ├── prisma/
│   │   └── schema.prisma           # Database schema (User model)
│   ├── src/
│   │   ├── auth/
│   │   │   ├── decorators/
│   │   │   │   └── current-user.decorator.ts
│   │   │   ├── dto/
│   │   │   │   ├── auth.response.ts
│   │   │   │   ├── login.input.ts
│   │   │   │   └── register.input.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.resolver.ts   # GraphQL endpoints
│   │   │   └── auth.service.ts    # Business logic
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── users/
│   │   │   ├── user.model.ts
│   │   │   ├── users.module.ts
│   │   │   └── users.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── schedule-service/
│   ├── prisma/
│   │   └── schema.prisma           # Database schema (Customer, Doctor, Schedule)
│   ├── src/
│   │   ├── auth/
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── auth.module.ts
│   │   ├── customers/
│   │   │   ├── dto/
│   │   │   │   ├── create-customer.input.ts
│   │   │   │   └── update-customer.input.ts
│   │   │   ├── customer.model.ts
│   │   │   ├── customers.module.ts
│   │   │   ├── customers.resolver.ts
│   │   │   └── customers.service.ts
│   │   ├── doctors/
│   │   │   ├── dto/
│   │   │   │   ├── create-doctor.input.ts
│   │   │   │   └── update-doctor.input.ts
│   │   │   ├── doctor.model.ts
│   │   │   ├── doctors.module.ts
│   │   │   ├── doctors.resolver.ts
│   │   │   └── doctors.service.ts
│   │   ├── schedules/
│   │   │   ├── dto/
│   │   │   │   ├── create-schedule.input.ts
│   │   │   │   └── filter-schedule.input.ts
│   │   │   ├── schedule.model.ts
│   │   │   ├── schedules.module.ts
│   │   │   ├── schedules.resolver.ts
│   │   │   └── schedules.service.ts  # Double-booking validation
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml              # Orchestration config
├── README.md                       # This file
└── .gitignore
```

---

## 📊 Database Schema

### Auth Service (`auth_db`)

```sql
-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Schedule Service (`schedule_db`)

```sql
-- customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- doctors table
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- schedules table
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objective VARCHAR(255) NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001
# or
netstat -tulpn | grep 3001

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check PostgreSQL container
docker logs healthcare-postgres

# Verify database exists
docker exec healthcare-postgres psql -U postgres -c "\l"

# Recreate databases
docker exec healthcare-postgres psql -U postgres -c "DROP DATABASE IF EXISTS auth_db;"
docker exec healthcare-postgres psql -U postgres -c "DROP DATABASE IF EXISTS schedule_db;"
docker exec healthcare-postgres psql -U postgres -c "CREATE DATABASE auth_db;"
docker exec healthcare-postgres psql -U postgres -c "CREATE DATABASE schedule_db;"
```

### Migration Errors

```bash
# Reset migrations (development only)
docker exec healthcare-auth npx prisma migrate reset --force
docker exec healthcare-schedule npx prisma migrate reset --force

# Reapply migrations
docker exec healthcare-auth npx prisma migrate deploy
docker exec healthcare-schedule npx prisma migrate deploy
```

### JWT Token Expired

Token expiry is set to 30 minutes by default. Register/login again to get a fresh token.

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 👥 Contributors

- **Developer:** Lahn Zikri

---

## 🙏 Acknowledgments

Built with:
- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [GraphQL](https://graphql.org/) - API query language
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [PostgreSQL](https://www.postgresql.org/) - Advanced open-source database
- [Docker](https://www.docker.com/) - Containerization platform

---

**Last Updated:** February 2, 2026
