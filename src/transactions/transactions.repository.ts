import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTransactions() {
    return this.prisma.transactions.findMany({
      include: {
        categories: true,
      },
    });
  }

  async getOneTransaction(id: number) {
    const transaction = await this.prisma.transactions.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Cannot find any matching record for ID ${id}`);
    }

    return transaction;
  }

  async executeInTransaction<T>(
    fn: (tx: Parameters<Parameters<PrismaService['$transaction']>[0]>[0]) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}