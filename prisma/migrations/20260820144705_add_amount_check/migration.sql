-- This is an empty migration.
ALTER TABLE "transaction" ADD CONSTRAINT amount_positive CHECK (amount > 0);