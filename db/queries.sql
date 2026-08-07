
SELECT id, account_id, category_id, amount, description, transaction_date
FROM transactions
WHERE type = 'expense' AND amount > 100000
ORDER BY transaction_date DESC;

SELECT
    t.id AS transaction_id,
    t.amount,
    t.transaction_date,
    a.name AS account_name,
    u.name AS user_name
FROM transactions t
JOIN accounts a ON t.account_id = a.id
JOIN users u ON a.user_id = u.id
ORDER BY t.transaction_date;

SELECT
    c.name AS category_name,
    COUNT(t.id) AS transaction_count,
    SUM(t.amount) AS total_spent
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY c.name
ORDER BY total_spent DESC;

WITH user_totals AS (
    SELECT
        u.id AS user_id,
        u.name AS user_name,
        SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) AS total_expense
    FROM users u
    JOIN accounts a ON a.user_id = u.id
    JOIN transactions t ON t.account_id = a.id
    GROUP BY u.id, u.name
)
SELECT
    user_name,
    total_income,
    total_expense,
    total_income - total_expense AS net_balance
FROM user_totals
ORDER BY net_balance DESC;

SELECT
    c.id,
    c.name,
    c.type
FROM categories c
LEFT JOIN transactions t ON t.category_id = c.id
WHERE t.id IS NULL;

SELECT
    a.id AS account_id,
    a.name AS account_name,
    a.type,
    a.balance,
    u.name AS owner_name
FROM accounts a
JOIN users u ON a.user_id = u.id
ORDER BY u.name, a.name;

SELECT
    a.id,
    a.name,
    a.balance
FROM accounts a
WHERE a.balance > (
    SELECT AVG(balance) FROM accounts
)
ORDER BY a.balance DESC;

SELECT
    account_id,
    transaction_date,
    amount,
    type,
    SUM(
        CASE WHEN type = 'income' THEN amount ELSE -amount END
    ) OVER (PARTITION BY account_id ORDER BY transaction_date) AS running_balance
FROM transactions
ORDER BY account_id, transaction_date;

SELECT
    DATE_TRUNC('month', transaction_date) AS month,
    type,
    SUM(amount) AS total_amount
FROM transactions
GROUP BY DATE_TRUNC('month', transaction_date), type
ORDER BY month, type;
