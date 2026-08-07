CREATE TYPE account_type AS ENUM ('cash', 'bank', 'e-wallet');
CREATE TYPE category_type AS ENUM ('income', 'expense');
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');

-- TABLE: users

CREATE TABLE users (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(100) NOT NULL,
    role       VARCHAR(20)  NOT NULL DEFAULT 'user',
    created_at TIMESTAMP(6) DEFAULT now()
);

-- TABLE: accounts

CREATE TABLE accounts (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL,
    name       VARCHAR(100) NOT NULL,
    type       account_type NOT NULL,
    balance    NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMP(6) DEFAULT now(),
    CONSTRAINT fk_accounts_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- TABLE: categories

CREATE TABLE categories (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type category_type NOT NULL
);

-- TABLE: transactions

CREATE TABLE transactions (
    id               SERIAL PRIMARY KEY,
    account_id       INTEGER NOT NULL,
    category_id      INTEGER NOT NULL,
    type             transaction_type NOT NULL,
    amount           NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    description      TEXT,
    transaction_date DATE NOT NULL,
    created_at       TIMESTAMP(6) DEFAULT now(),
    CONSTRAINT fk_transactions_account
        FOREIGN KEY (account_id) REFERENCES accounts(id)
        ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT fk_transactions_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- INDEXES (for common lookups/joins)

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
