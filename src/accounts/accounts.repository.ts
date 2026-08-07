import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAllAccounts() {
    return this.prisma.accounts.findMany();
  }

  getAllAccountsForUser(userId: number) {
    return this.prisma.accounts.findMany({ where: { user_id: userId } });
  }

  async getOneAccount(id: number) {
    return this.prisma.accounts.findUnique({ where: { id } });
  }

  createAccount(dto: CreateAccountDto) {
    return this.prisma.accounts.create({ data: dto });
  }

  updateAccount(id: number, dto: UpdateAccountDto) {
    return this.prisma.accounts.update({
      where: { id },
      data: dto,
    });
  }

  deleteAccount(id: number) {
    return this.prisma.accounts.delete({ where: { id } });
  }

  async updateBalance(accountId: number, changeAmount: number) {
    return this.prisma.accounts.update({
      where: { id: accountId },
      data: { balance: { increment: changeAmount } },
    });
  }
}