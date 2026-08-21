import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { BalanceCalculatorService } from './balance-calculator.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly repository: TransactionsRepository,
    private readonly balanceCalculator: BalanceCalculatorService,
  ) {}

  getAllTransactions(userId: number) {
    return this.repository.getAllTransactionsForUser(userId);
  }

  async getOneTransaction(id: number, userId: number) {
    const transaction = await this.repository.getOneTransaction(id);
    if (transaction.account.user_id !== userId) throw new ForbiddenException();
    return transaction;
  }

  async createTransaction(dto: CreateTransactionDto, userId: number) {
    return this.repository.executeInTransaction(async (tx) => {
      const targetAccount = await tx.account.findUnique({ where: { id: dto.account_id } });
      if (!targetAccount) throw new NotFoundException(`Account with ID ${dto.account_id} not found`);
      if (targetAccount.user_id !== userId) throw new ForbiddenException();

      const balanceImpact = this.balanceCalculator.calculateImpact(dto.type, Number(dto.amount));

      if (balanceImpact !== 0) {
        await tx.account.update({
          where: { id: dto.account_id },
          data: { balance: { increment: balanceImpact } },
        });
      }

      return tx.transaction.create({
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

  async updateTransaction(id: number, dto: UpdateTransactionDto, userId: number) {
    return this.repository.executeInTransaction(async (tx) => {
      const existing = await tx.transaction.findUnique({ where: { id }, include: { account: true } });
      if (!existing) throw new NotFoundException(`Transaction with ID ${id} not found`);
      if (existing.account.user_id !== userId) throw new ForbiddenException();

      if (dto.account_id && dto.account_id !== existing.account_id) {
        const targetAccount = await tx.account.findUnique({ where: { id: dto.account_id } });
        if (!targetAccount) throw new NotFoundException(`Account with ID ${dto.account_id} not found`);
        if (targetAccount.user_id !== userId) throw new ForbiddenException();
      }

      const oldImpact = this.balanceCalculator.calculateImpact(existing.type, Number(existing.amount));
      if (oldImpact !== 0) {
        await tx.account.update({
          where: { id: existing.account_id },
          data: { balance: { decrement: oldImpact } },
        });
      }

      const newAmount = dto.amount !== undefined ? Number(dto.amount) : Number(existing.amount);
      const newType = dto.type ?? existing.type;
      const targetAccountId = dto.account_id ?? existing.account_id;

      const newImpact = this.balanceCalculator.calculateImpact(newType, newAmount);
      if (newImpact !== 0) {
        await tx.account.update({
          where: { id: targetAccountId },
          data: { balance: { increment: newImpact } },
        });
      }

      return tx.transaction.update({
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

  async deleteTransaction(id: number, userId: number) {
    return this.repository.executeInTransaction(async (tx) => {
      const existing = await tx.transaction.findUnique({ where: { id }, include: { account: true } });
      if (!existing) throw new NotFoundException(`Transaction with ID ${id} not found`);
      if (existing.account.user_id !== userId) throw new ForbiddenException();

      const balanceImpact = this.balanceCalculator.calculateImpact(existing.type, Number(existing.amount));
      if (balanceImpact !== 0) {
        await tx.account.update({
          where: { id: existing.account_id },
          data: { balance: { decrement: balanceImpact } },
        });
      }

      return tx.transaction.delete({ where: { id } });
    });
  }
}