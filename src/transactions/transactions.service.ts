import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionType } from './transaction-type.enum';

@Injectable()
export class TransactionsService {
  constructor(private readonly repository: TransactionsRepository) {}

  getAllTransactions() {
    return this.repository.getAllTransactions();
  }

  getOneTransaction(id: number) {
    return this.repository.getOneTransaction(id);
  }

  async createTransaction(dto: CreateTransactionDto) {
    return this.repository.executeInTransaction(async (tx) => {
      const amount = Number(dto.amount);
      
      let balanceImpact = 0;
      if (dto.type === TransactionType.INCOME) balanceImpact = amount;
      if (dto.type === TransactionType.EXPENSE) balanceImpact = -amount;

      // 1. Recalculate account balance
      if (balanceImpact !== 0) {
        await tx.accounts.update({
          where: { id: dto.account_id },
          data: { balance: { increment: balanceImpact } },
        }).catch(() => {
          throw new NotFoundException(`Account with ID ${dto.account_id} not found`);
        });
      }

      // 2. Create transaction record
      return tx.transactions.create({
        data: {
          account_id: dto.account_id,
          category_id: dto.category_id,
          type: dto.type,
          amount: dto.amount,
          description: dto.description,
          transaction_date: new Date(dto.transaction_date),
        },
      });
    });
  }

  async updateTransaction(id: number, dto: UpdateTransactionDto) {
    return this.repository.executeInTransaction(async (tx) => {
      const existing = await tx.transactions.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }

      // 1. Revert previous balance impact
      const oldAmount = Number(existing.amount);
      let oldImpact = 0;
      if (existing.type === TransactionType.INCOME) oldImpact = oldAmount;
      if (existing.type === TransactionType.EXPENSE) oldImpact = -oldAmount;

      if (oldImpact !== 0) {
        await tx.accounts.update({
          where: { id: existing.account_id },
          data: { balance: { decrement: oldImpact } },
        });
      }

      // 2. Apply new balance impact
      const newAmount = dto.amount !== undefined ? Number(dto.amount) : oldAmount;
      const newType = dto.type ?? existing.type;
      const targetAccountId = dto.account_id ?? existing.account_id;

      let newImpact = 0;
      if (newType === TransactionType.INCOME) newImpact = newAmount;
      if (newType === TransactionType.EXPENSE) newImpact = -newAmount;

      if (newImpact !== 0) {
        await tx.accounts.update({
          where: { id: targetAccountId },
          data: { balance: { increment: newImpact } },
        });
      }

      // 3. Update transaction record
      return tx.transactions.update({
        where: { id },
        data: {
          ...(dto.account_id && { account_id: dto.account_id }),
          ...(dto.category_id && { category_id: dto.category_id }),
          ...(dto.type && { type: dto.type }),
          ...(dto.amount && { amount: dto.amount }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.transaction_date && { transaction_date: new Date(dto.transaction_date) }),
        },
      });
    });
  }

  async deleteTransaction(id: number) {
    return this.repository.executeInTransaction(async (tx) => {
      const existing = await tx.transactions.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }

      // 1. Revert balance impact
      const amount = Number(existing.amount);
      let balanceImpact = 0;
      if (existing.type === TransactionType.INCOME) balanceImpact = amount;
      if (existing.type === TransactionType.EXPENSE) balanceImpact = -amount;

      if (balanceImpact !== 0) {
        await tx.accounts.update({
          where: { id: existing.account_id },
          data: { balance: { decrement: balanceImpact } },
        });
      }

      // 2. Delete transaction record
      return tx.transactions.delete({ where: { id } });
    });
  }
}