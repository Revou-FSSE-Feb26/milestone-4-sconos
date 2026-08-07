-- USERS

INSERT INTO users (name, email, password, role) VALUES
('Alice Johnson',  'alice@example.com',   'hashedpassword123', 'user'),
('Bob Smith',      'bob@example.com',     'hashedpassword456', 'user'),
('Charlie Brown',  'charlie@example.com', 'hashedpassword789', 'user');

-- ACCOUNTS

INSERT INTO accounts (user_id, name, type, balance) VALUES
(1, 'Alice Checking', 'bank',     15000000.00),
(1, 'Alice GoPay',    'e-wallet',   500000.00),
(2, 'Bob Savings',    'bank',     25000000.00),
(2, 'Bob Wallet',     'cash',       750000.00),
(3, 'Charlie Checking','bank',     8000000.00),
(3, 'Charlie OVO',    'e-wallet',   350000.00);

-- CATEGORIES

INSERT INTO categories (name, type) VALUES
('Salary',        'income'),
('Freelance',      'income'),
('Food & Dining',  'expense'),
('Utilities',      'expense'),
('Transportation', 'expense'),
('Entertainment',  'expense');

-- TRANSACTIONS

INSERT INTO transactions (account_id, category_id, type, amount, description, transaction_date) VALUES
-- Alice (accounts 1, 2)
(1, 1, 'income',  10000000.00, 'Monthly Salary',      '2026-06-01'),
(1, 4, 'expense',    500000.00, 'Electricity Bill',    '2026-06-03'),
(2, 3, 'expense',     75000.00, 'Lunch',               '2026-06-05'),
(2, 5, 'expense',     30000.00, 'Taxi fare',           '2026-06-07'),
(1, 6, 'expense',    150000.00, 'Cinema ticket',       '2026-06-10'),

-- Bob (accounts 3, 4)
(3, 1, 'income',  18000000.00, 'Base Salary',          '2026-06-01'),
(3, 2, 'income',   5000000.00, 'Web Dev Project',      '2026-06-04'),
(4, 3, 'expense',    120000.00, 'Groceries',            '2026-06-06'),
(4, 5, 'expense',    200000.00, 'Fuel',                 '2026-06-08'),
(3, 4, 'expense',    800000.00, 'Internet & WiFi',      '2026-06-12'),
(4, 3, 'expense',     45000.00, 'Coffee',               '2026-06-15'),
(3, 6, 'expense',    300000.00, 'Concert Ticket',       '2026-06-18'),

-- Charlie (accounts 5, 6)
(5, 1, 'income',   7000000.00, 'Part-time Pay',        '2026-06-02'),
(6, 3, 'expense',     50000.00, 'Dinner',               '2026-06-04'),
(5, 4, 'expense',    250000.00, 'Water Bill',           '2026-06-09'),
(6, 5, 'expense',     25000.00, 'Bus pass',             '2026-06-11'),
(5, 3, 'expense',    150000.00, 'Weekly groceries',     '2026-06-14'),
(6, 6, 'expense',    100000.00, 'Gaming subscription',  '2026-06-16'),
(5, 2, 'income',   1500000.00, 'Logo Design',          '2026-06-20'),
(6, 3, 'expense',     35000.00, 'Snacks',               '2026-06-22');
