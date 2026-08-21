import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTransactionsForUser(userId: number) {
    return this.prisma.transaction.findMany({
      where: { account: { user_id: userId } },
      include: { category: true },
    });
  }

  async getOneTransaction(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { category: true, account: true },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async executeInTransaction<T>(
    fn: (tx: Parameters<Parameters<PrismaService['$transaction']>[0]>[0]) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}