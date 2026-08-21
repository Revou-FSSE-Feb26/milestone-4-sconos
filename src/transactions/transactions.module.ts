import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { PrismaModule } from '../prisma/prisma.module'; // Ensure proper relative path
import { BalanceCalculatorService } from './balance-calculator.service';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository, BalanceCalculatorService],
  exports: [TransactionsService],
})
export class TransactionsModule {}