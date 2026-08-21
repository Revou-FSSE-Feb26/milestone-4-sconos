import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../generated/prisma/client';

@Injectable()
export class BalanceCalculatorService {
  calculateImpact(type: TransactionType, amount: number): number {
    switch (type) {
      case TransactionType.income:
        return amount;
      case TransactionType.expense:
        return -amount;
      default:
        return 0;
    }
  }
}