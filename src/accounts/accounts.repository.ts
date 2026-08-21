import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAllAccounts() {
    return this.prisma.account.findMany();
  }

  getAllAccountsForUser(userId: number) {
    return this.prisma.account.findMany({ where: { user_id: userId } });
  }

  async getOneAccount(id: number) {
    return this.prisma.account.findUnique({ where: { id } });
  }

  createAccount(dto: CreateAccountDto & { user_id: number }) {
    return this.prisma.account.create({ data: dto });
  }

  updateAccount(id: number, dto: UpdateAccountDto) {
    return this.prisma.account.update({
      where: { id },
      data: dto,
    });
  }

  deleteAccount(id: number) {
    return this.prisma.account.delete({ where: { id } });
  }

  async updateBalance(accountId: number, changeAmount: number) {
    return this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: changeAmount } },
    });
  }
}