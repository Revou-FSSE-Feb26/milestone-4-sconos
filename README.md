# FinTrack API

A personal finance tracking backend built with **NestJS**, **Prisma**, and **PostgreSQL**. FinTrack lets users manage multiple accounts (cash, bank, e-wallet), categorize income and expenses, and track transactions with automatic account balance updates.

**Live deployment:** [milestone-4-sconos-production.up.railway.app](https://milestone-4-sconos-production.up.railway.app/)

---

## Table of Contents

- [Domain Overview](#domain-overview)
- [Entity-Relationship Diagram](#entity-relationship-diagram)
- [Tech Stack](#tech-stack)
- [Project Setup](#project-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Running the SQL Files](#running-the-sql-files)
- [API Documentation](#api-documentation)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Authentication & Security](#authentication--security)
- [Known Limitations](#known-limitations)

---

## Domain Overview

FinTrack models a simple personal finance system:

- **Users** register and log in to manage their own financial data. Each user has a `role` (`user` or `admin`).
- **Accounts** belong to a user and represent a place money is held — cash, a bank account, or an e-wallet. Each account has a running `balance`.
- **Categories** classify transactions as either `income` or `expense` (e.g. Salary, Groceries, Utilities).
- **Transactions** belong to an account and a category, and are typed as `income`, `expense`, or `transfer`. Creating, updating, or deleting a transaction automatically recalculates the owning account's balance — income adds to the balance, expense subtracts from it.

Every account and transaction is scoped to the user who owns it; users can only see and modify their own data, enforced via JWT authentication and per-user ownership checks.

## Entity-Relationship Diagram

![FinTrack ERD](./docs/ERD.png)

**Relationships:**
- One `User` has many `Accounts`
- One `Account` has many `Transactions`
- One `Category` has many `Transactions`

## Tech Stack

- **Framework:** NestJS
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt password hashing
- **Validation:** class-validator / class-transformer via NestJS `ValidationPipe`
- **Security:** Helmet, CORS, rate limiting on login

## Project Setup

```bash
# Clone the repo
git clone https://github.com/Revou-FSSE-Feb26/milestone-4-sconos.git
cd milestone-4-sconos

# Install dependencies
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

| Variable       | Description                                      | Example                                              |
|----------------|---------------------------------------------------|-------------------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string                      | `postgresql://user:password@localhost:5432/fintrack`  |
| `JWT_SECRET`   | Secret key used to sign JWTs                      | `some-long-random-string`                              |
| `JWT_EXPIRES_IN` | Token expiry duration                           | `1d`                                                    |
| `PORT`         | Port the server runs on                           | `3000`                                                  |

A `.env.example` file with these placeholders is included in the repo root — never commit your actual `.env`.

## Running the Project

```bash
# Run Prisma migrations against your database
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed

# Start the development server
npm run start:dev

# Run tests
npm run test
npm run test:e2e
```

The API will be available at `http://localhost:3000` by default.

## Running the SQL Files

The `db/` folder contains the raw SQL equivalents of the Prisma schema, useful for understanding the schema independently of the ORM or running against a plain PostgreSQL instance:

```bash
psql -U your_user -d fintrack -f db/schema.sql
psql -U your_user -d fintrack -f db/seed.sql
psql -U your_user -d fintrack -f db/queries.sql
```

## API Documentation

- **Postman collection:** [`docs/fintrack.postman_collection.json`](./docs/fintrack.postman_collection.json) — import into Postman along with the accompanying environment file (`base_url` and a placeholder `token` variable). Includes example requests/responses for every endpoint, including the full auth flow (register → login → authorized request) and a blocked-request example.
- **Smoke test examples:** [`docs/api-smoke-test.md`](./docs/api-smoke-test.md) — one example request and response per endpoint.

## Architecture & Design Decisions

- **Modular structure:** one module/controller/service per resource (`users`, `accounts`, `categories`, `transactions`, `auth`), keeping each resource's logic self-contained.
- **Service-layer isolation:** business logic (like balance recalculation) lives in services, not controllers, so it stays testable and swappable independent of the transport layer.
- **Custom provider — `BalanceCalculatorService`:** account balance recalculation was factored out of `TransactionsService` into its own injectable provider. This keeps the transaction service focused on CRUD orchestration while balance math (income adds, expense subtracts, transfer handling) lives in one place, is independently unit-testable, and can be reused anywhere balances need recalculating without duplicating logic.
- **Request logging middleware:** a custom middleware logs method, path, status code, and response time for every request, registered globally via `configure(consumer)` in `AppModule`.
- **Global `ValidationPipe`:** configured with `whitelist`, `forbidNonWhitelisted`, and `transform` enabled, so every incoming request is validated and stripped of unexpected fields before it reaches a controller.

## Authentication & Security

- **Registration & login:** `POST /auth/register` and `POST /auth/login`. Passwords are hashed with bcrypt before storage and are never returned in any API response.
- **JWT:** issued on successful login, required (via a guard) on all `accounts` and `transactions` routes.
- **Ownership enforcement:** every resource access checks that the authenticated user owns the account/transaction being accessed — users cannot read or modify another user's data.
- **RBAC:** a `role` field (`user` | `admin`) on the `User` model, with an RBAC guard restricting at least one admin-only action.
- **Rate limiting:** a global throttler (ThrottlerModule + APP_GUARD) limits all requests, including login, to 10 requests/60s per client.
- **CORS:** explicitly configured rather than left permissive by default.
- **Helmet:** enabled globally for standard HTTP security headers.

## Known Limitations

- No refresh token flow — JWTs simply expire and require re-login.
- No pagination on list endpoints (`GET /transactions`, etc.) — all records are returned at once, which won't scale well with large datasets.
- No automated CI pipeline; tests are run manually before deployment.
- `transfer`-type transactions are recorded but do not yet move balances between two accounts automatically — this is planned as a future enhancement.
- Free-tier hosting may spin down when idle, causing a slower first response after inactivity.

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/TLpjRxBx)
