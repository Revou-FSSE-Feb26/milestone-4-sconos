# FinTrack API — Smoke Test

One example request and response per endpoint, run against a working local/deployed instance.

> ⚠️ Placeholder values used below:
> - `account_type` example: `CASH` — replace with your real enum values from `prisma/schema.prisma`
> - `CategoryType` / `TransactionType` examples: `INCOME` / `EXPENSE` — replace with your real values from `category-type.enum.ts` / `transaction-type.enum.ts`
> - `{{token}}` — a JWT obtained from `POST /auth/login`, sent as `Authorization: Bearer {{token}}`

Base URL used for this test run: `<PASTE YOUR DEPLOYED BASE URL HERE>`

---

## Auth

### POST /auth/register
**Request**
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response — 201 Created**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

### POST /auth/login
**Request**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response — 200 OK**
```json
{
  "access_token": "<jwt-token>"
}
```

---

## Users

### GET /users
**Request**
```http
GET /users
```
**Response — 200 OK**
```json
[
  { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "user" }
]
```

### GET /users/:id
**Request**
```http
GET /users/1
```
**Response — 200 OK**
```json
{ "id": 1, "name": "John Doe", "email": "john@example.com", "role": "user" }
```
**Response — 404 Not Found** (id does not exist)
```json
{ "statusCode": 404, "message": "User with id 999 not found" }
```

### POST /users
**Request**
```http
POST /users
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123"
}
```
**Response — 201 Created**
```json
{ "id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "user" }
```

### PATCH /users/:id
**Request**
```http
PATCH /users/1
Content-Type: application/json

{ "name": "Jane Updated" }
```
**Response — 200 OK**
```json
{ "id": 1, "name": "Jane Updated", "email": "john@example.com", "role": "user" }
```

### DELETE /users/:id
**Request**
```http
DELETE /users/1
```
**Response — 200 OK**
```json
{ "id": 1, "deleted": true }
```

---

## Accounts

### GET /accounts
**Request**
```http
GET /accounts
Authorization: Bearer {{token}}
```
**Response — 200 OK**
```json
[
  { "id": 1, "user_id": 1, "name": "Main Wallet", "type": "CASH", "balance": "500000.00" }
]
```

### GET /accounts/:id
**Request**
```http
GET /accounts/1
Authorization: Bearer {{token}}
```
**Response — 200 OK**
```json
{ "id": 1, "user_id": 1, "name": "Main Wallet", "type": "CASH", "balance": "500000.00" }
```
**Response — 404 Not Found**
```json
{ "statusCode": 404, "message": "Account with id 999 not found" }
```

### POST /accounts
**Request**
```http
POST /accounts
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "user_id": 1,
  "name": "Main Wallet",
  "type": "CASH",
  "balance": 500000
}
```
**Response — 201 Created**
```json
{ "id": 1, "user_id": 1, "name": "Main Wallet", "type": "CASH", "balance": "500000.00" }
```

### PATCH /accounts/:id
**Request**
```http
PATCH /accounts/1
Authorization: Bearer {{token}}
Content-Type: application/json

{ "name": "Updated Wallet Name", "balance": 750000 }
```
**Response — 200 OK**
```json
{ "id": 1, "user_id": 1, "name": "Updated Wallet Name", "type": "CASH", "balance": "750000.00" }
```

### DELETE /accounts/:id
**Request**
```http
DELETE /accounts/1
Authorization: Bearer {{token}}
```
**Response — 200 OK**
```json
{ "id": 1, "deleted": true }
```

---

## Categories

### GET /categories
**Request**
```http
GET /categories
```
**Response — 200 OK**
```json
[
  { "id": 1, "name": "Groceries", "type": "EXPENSE" }
]
```

### GET /categories/:id
**Request**
```http
GET /categories/1
```
**Response — 200 OK**
```json
{ "id": 1, "name": "Groceries", "type": "EXPENSE" }
```
**Response — 404 Not Found**
```json
{ "statusCode": 404, "message": "Category with id 999 not found" }
```

### POST /categories
**Request**
```http
POST /categories
Content-Type: application/json

{ "name": "Groceries", "type": "EXPENSE" }
```
**Response — 201 Created**
```json
{ "id": 1, "name": "Groceries", "type": "EXPENSE" }
```

### PATCH /categories/:id
**Request**
```http
PATCH /categories/1
Content-Type: application/json

{ "name": "Groceries & Household" }
```
**Response — 200 OK**
```json
{ "id": 1, "name": "Groceries & Household", "type": "EXPENSE" }
```

### DELETE /categories/:id
**Request**
```http
DELETE /categories/1
```
**Response — 200 OK**
```json
{ "id": 1, "deleted": true }
```

---

## Transactions

### GET /transactions
**Request**
```http
GET /transactions
Authorization: Bearer {{token}}
```
**Response — 200 OK**
```json
[
  {
    "id": 1,
    "account_id": 1,
    "category_id": 1,
    "type": "EXPENSE",
    "amount": "50000.00",
    "description": "Lunch with client",
    "transaction_date": "2026-08-05"
  }
]
```

### GET /transactions/:id
**Request**
```http
GET /transactions/1
Authorization: Bearer {{token}}
```
**Response — 200 OK**
```json
{
  "id": 1,
  "account_id": 1,
  "category_id": 1,
  "type": "EXPENSE",
  "amount": "50000.00",
  "description": "Lunch with client",
  "transaction_date": "2026-08-05"
}
```
**Response — 404 Not Found**
```json
{ "statusCode": 404, "message": "Transaction with id 999 not found" }
```

### POST /transactions
**Request**
```http
POST /transactions
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "account_id": 1,
  "category_id": 1,
  "type": "EXPENSE",
  "amount": 50000,
  "description": "Lunch with client",
  "transaction_date": "2026-08-05"
}
```
**Response — 201 Created**
```json
{
  "id": 1,
  "account_id": 1,
  "category_id": 1,
  "type": "EXPENSE",
  "amount": "50000.00",
  "description": "Lunch with client",
  "transaction_date": "2026-08-05"
}
```
> Creating this transaction also updates the owning account's balance (expense subtracts, income adds) via the balance-update business logic in the service layer.

### PATCH /transactions/:id
**Request**
```http
PATCH /transactions/1
Authorization: Bearer {{token}}
Content-Type: application/json

{ "amount": 60000, "description": "Lunch with client (updated)" }
```
**Response — 200 OK**
```json
{
  "id": 1,
  "account_id": 1,
  "category_id": 1,
  "type": "EXPENSE",
  "amount": "60000.00",
  "description": "Lunch with client (updated)",
  "transaction_date": "2026-08-05"
}
```
> Account balance is recalculated to reflect the updated amount.

### DELETE /transactions/:id
**Request**
```http
DELETE /transactions/1
Authorization: Bearer {{token}}
```
**Response — 200 OK**
```json
{ "id": 1, "deleted": true }
```
> Account balance is recalculated to reverse the deleted transaction's effect.

---

## Validation error example (global ValidationPipe)

**Request**
```http
POST /transactions
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "account_id": 1,
  "category_id": 1,
  "type": "NOT_A_REAL_TYPE",
  "amount": -50000,
  "transaction_date": "not-a-date"
}
```
**Response — 400 Bad Request**
```json
{
  "statusCode": 400,
  "message": [
    "type must be a valid enum value",
    "amount must be a positive number",
    "transaction_date must be a valid ISO 8601 date string"
  ],
  "error": "Bad Request"
}
```

## Blocked-request example (no/invalid token)

**Request**
```http
GET /accounts
```
**Response — 401 Unauthorized**
```json
{ "statusCode": 401, "message": "Unauthorized" }
```
