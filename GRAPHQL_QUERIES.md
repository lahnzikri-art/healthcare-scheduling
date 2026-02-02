# Healthcare Scheduling System - GraphQL Queries Collection

This file contains all GraphQL queries and mutations for testing the Healthcare Scheduling System.

## Setup

1. **Get JWT Token First** - All Schedule Service endpoints require authentication
2. **Set HTTP Headers** in GraphQL Playground:
   ```json
   {
     "Authorization": "Bearer <your-access-token>"
   }
   ```

---

## Auth Service Endpoints (Port 3001)

### 1. Register User

```graphql
mutation RegisterUser {
  register(data: {
    email: "test@example.com"
    password: "password123"
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

### 2. Login

```graphql
mutation LoginUser {
  login(data: {
    email: "test@example.com"
    password: "password123"
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

### 3. Validate Token

**⚠️ Requires Authorization Header**

```graphql
query ValidateToken {
  validateToken {
    id
    email
    createdAt
    updatedAt
  }
}
```

---

## Schedule Service - Customer Endpoints (Port 3002)

**⚠️ All endpoints require Authorization Header with JWT token**

### 1. Create Customer

```graphql
mutation CreateCustomer {
  createCustomer(input: {
    name: "John Doe"
    email: "john.doe@example.com"
  }) {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

### 2. Create Multiple Customers (for testing)

```graphql
mutation CreateCustomer1 {
  customer1: createCustomer(input: {
    name: "Alice Johnson"
    email: "alice@example.com"
  }) {
    id
    name
    email
  }
}

mutation CreateCustomer2 {
  customer2: createCustomer(input: {
    name: "Bob Smith"
    email: "bob@example.com"
  }) {
    id
    name
    email
  }
}

mutation CreateCustomer3 {
  customer3: createCustomer(input: {
    name: "Charlie Brown"
    email: "charlie@example.com"
  }) {
    id
    name
    email
  }
}
```

### 3. Update Customer

```graphql
mutation UpdateCustomer {
  updateCustomer(
    id: "REPLACE_WITH_CUSTOMER_ID"
    input: {
      name: "John Updated Doe"
      email: "john.updated@example.com"
    }
  ) {
    id
    name
    email
    updatedAt
  }
}
```

### 4. List All Customers

```graphql
query ListCustomers {
  customers {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

### 5. List Customers with Pagination

```graphql
query ListCustomersPaginated {
  customers(skip: 0, take: 5) {
    id
    name
    email
    createdAt
  }
}
```

### 6. Get Customer by ID

```graphql
query GetCustomer {
  customer(id: "REPLACE_WITH_CUSTOMER_ID") {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

### 7. Delete Customer

```graphql
mutation DeleteCustomer {
  deleteCustomer(id: "REPLACE_WITH_CUSTOMER_ID")
}
```

---

## Schedule Service - Doctor Endpoints (Port 3002)

### 1. Create Doctor

```graphql
mutation CreateDoctor {
  createDoctor(input: {
    name: "Dr. Sarah Williams"
  }) {
    id
    name
    createdAt
    updatedAt
  }
}
```

### 2. Create Multiple Doctors (for testing)

```graphql
mutation CreateDoctor1 {
  doctor1: createDoctor(input: {
    name: "Dr. Michael Johnson"
  }) {
    id
    name
  }
}

mutation CreateDoctor2 {
  doctor2: createDoctor(input: {
    name: "Dr. Emily Chen"
  }) {
    id
    name
  }
}

mutation CreateDoctor3 {
  doctor3: createDoctor(input: {
    name: "Dr. David Martinez"
  }) {
    id
    name
  }
}
```

### 3. Update Doctor

```graphql
mutation UpdateDoctor {
  updateDoctor(
    id: "REPLACE_WITH_DOCTOR_ID"
    input: {
      name: "Dr. Sarah Williams Jr."
    }
  ) {
    id
    name
    updatedAt
  }
}
```

### 4. List All Doctors

```graphql
query ListDoctors {
  doctors {
    id
    name
    createdAt
    updatedAt
  }
}
```

### 5. List Doctors with Pagination

```graphql
query ListDoctorsPaginated {
  doctors(skip: 0, take: 5) {
    id
    name
    createdAt
  }
}
```

### 6. Get Doctor by ID

```graphql
query GetDoctor {
  doctor(id: "REPLACE_WITH_DOCTOR_ID") {
    id
    name
    createdAt
    updatedAt
  }
}
```

### 7. Delete Doctor

```graphql
mutation DeleteDoctor {
  deleteDoctor(id: "REPLACE_WITH_DOCTOR_ID")
}
```

---

## Schedule Service - Schedule Endpoints (Port 3002)

### 1. Create Schedule

```graphql
mutation CreateSchedule {
  createSchedule(input: {
    objective: "Annual physical checkup"
    customerId: "REPLACE_WITH_CUSTOMER_ID"
    doctorId: "REPLACE_WITH_DOCTOR_ID"
    scheduledAt: "2026-03-15T10:00:00Z"
  }) {
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

### 2. Create Multiple Schedules (for testing)

```graphql
mutation CreateSchedule1 {
  schedule1: createSchedule(input: {
    objective: "Consultation for headache"
    customerId: "REPLACE_WITH_CUSTOMER_ID_1"
    doctorId: "REPLACE_WITH_DOCTOR_ID_1"
    scheduledAt: "2026-03-15T09:00:00Z"
  }) {
    id
    objective
    scheduledAt
  }
}

mutation CreateSchedule2 {
  schedule2: createSchedule(input: {
    objective: "Follow-up appointment"
    customerId: "REPLACE_WITH_CUSTOMER_ID_2"
    doctorId: "REPLACE_WITH_DOCTOR_ID_1"
    scheduledAt: "2026-03-15T11:00:00Z"
  }) {
    id
    objective
    scheduledAt
  }
}

mutation CreateSchedule3 {
  schedule3: createSchedule(input: {
    objective: "General checkup"
    customerId: "REPLACE_WITH_CUSTOMER_ID_3"
    doctorId: "REPLACE_WITH_DOCTOR_ID_2"
    scheduledAt: "2026-03-15T14:00:00Z"
  }) {
    id
    objective
    scheduledAt
  }
}
```

### 3. Test Double-Booking Validation (Should Fail)

**This mutation should return a 409 Conflict error**

```graphql
mutation TestDoubleBooking {
  createSchedule(input: {
    objective: "This should fail - same doctor same time"
    customerId: "REPLACE_WITH_CUSTOMER_ID"
    doctorId: "REPLACE_WITH_DOCTOR_ID"
    scheduledAt: "2026-03-15T10:00:00Z"  # Same time as existing schedule
  }) {
    id
  }
}
```

**Expected Error:**
```json
{
  "errors": [
    {
      "message": "Doctor already has a schedule at this time",
      "extensions": {
        "code": "CONFLICT"
      }
    }
  ]
}
```

### 4. Test Invalid Customer ID (Should Fail)

```graphql
mutation TestInvalidCustomer {
  createSchedule(input: {
    objective: "Test invalid customer"
    customerId: "00000000-0000-0000-0000-000000000000"
    doctorId: "REPLACE_WITH_DOCTOR_ID"
    scheduledAt: "2026-03-15T15:00:00Z"
  }) {
    id
  }
}
```

**Expected Error:**
```json
{
  "errors": [
    {
      "message": "Customer not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

### 5. Test Invalid Doctor ID (Should Fail)

```graphql
mutation TestInvalidDoctor {
  createSchedule(input: {
    objective: "Test invalid doctor"
    customerId: "REPLACE_WITH_CUSTOMER_ID"
    doctorId: "00000000-0000-0000-0000-000000000000"
    scheduledAt: "2026-03-15T15:00:00Z"
  }) {
    id
  }
}
```

**Expected Error:**
```json
{
  "errors": [
    {
      "message": "Doctor not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

### 6. List All Schedules

```graphql
query ListSchedules {
  schedules {
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

### 7. Filter Schedules by Customer

```graphql
query FilterSchedulesByCustomer {
  schedules(filter: {
    customerId: "REPLACE_WITH_CUSTOMER_ID"
  }) {
    id
    objective
    scheduledAt
    doctor {
      name
    }
    createdAt
  }
}
```

### 8. Filter Schedules by Doctor

```graphql
query FilterSchedulesByDoctor {
  schedules(filter: {
    doctorId: "REPLACE_WITH_DOCTOR_ID"
  }) {
    id
    objective
    scheduledAt
    customer {
      name
      email
    }
    createdAt
  }
}
```

### 9. List Schedules with Pagination

```graphql
query ListSchedulesPaginated {
  schedules(skip: 0, take: 10) {
    id
    objective
    scheduledAt
    customer {
      name
    }
    doctor {
      name
    }
  }
}
```

### 10. Get Schedule by ID

```graphql
query GetSchedule {
  schedule(id: "REPLACE_WITH_SCHEDULE_ID") {
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

### 11. Delete Schedule

```graphql
mutation DeleteSchedule {
  deleteSchedule(id: "REPLACE_WITH_SCHEDULE_ID")
}
```

---

## Error Testing

### Test Unauthorized Access (No JWT Token)

**Remove Authorization header and try:**

```graphql
query TestUnauthorized {
  customers {
    id
  }
}
```

**Expected Error:**
```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

---

## Complete Testing Flow

### Step-by-Step Test Scenario

```graphql
# 1. Register User (Auth Service - Port 3001)
mutation Step1_Register {
  register(data: {
    email: "tester@example.com"
    password: "test123"
  }) {
    accessToken
    user { id email }
  }
}

# 2. Copy accessToken and set Authorization header for Schedule Service

# 3. Create Customer (Schedule Service - Port 3002)
mutation Step2_CreateCustomer {
  createCustomer(input: {
    name: "Test Customer"
    email: "testcustomer@example.com"
  }) {
    id
    name
    email
  }
}

# 4. Create Doctor
mutation Step3_CreateDoctor {
  createDoctor(input: {
    name: "Dr. Test Doctor"
  }) {
    id
    name
  }
}

# 5. Create Schedule (use IDs from steps 3 and 4)
mutation Step4_CreateSchedule {
  createSchedule(input: {
    objective: "Test consultation"
    customerId: "CUSTOMER_ID_FROM_STEP3"
    doctorId: "DOCTOR_ID_FROM_STEP4"
    scheduledAt: "2026-04-01T10:00:00Z"
  }) {
    id
    objective
    scheduledAt
    customer { name }
    doctor { name }
  }
}

# 6. Verify Double-Booking Validation (should fail)
mutation Step5_TestDoubleBooking {
  createSchedule(input: {
    objective: "Duplicate schedule"
    customerId: "CUSTOMER_ID_FROM_STEP3"
    doctorId: "DOCTOR_ID_FROM_STEP4"
    scheduledAt: "2026-04-01T10:00:00Z"  # Same time!
  }) {
    id
  }
}

# 7. List All Schedules
query Step6_ListSchedules {
  schedules {
    id
    objective
    scheduledAt
    customer { name email }
    doctor { name }
  }
}

# 8. Filter by Doctor
query Step7_FilterByDoctor {
  schedules(filter: {
    doctorId: "DOCTOR_ID_FROM_STEP4"
  }) {
    id
    objective
    customer { name }
  }
}

# 9. Delete Schedule
mutation Step8_DeleteSchedule {
  deleteSchedule(id: "SCHEDULE_ID_FROM_STEP5")
}

# 10. Verify deletion
query Step9_VerifyDeletion {
  schedules {
    id
  }
}
```

---

## Notes

- All timestamps use ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`
- Replace placeholder IDs (e.g., `REPLACE_WITH_CUSTOMER_ID`) with actual UUIDs from responses
- JWT token expires in 30 minutes by default - re-login if needed
- Double-booking validation checks exact datetime match
- Cascade delete: Deleting customer/doctor also deletes their schedules

---

**Last Updated:** February 2, 2026
