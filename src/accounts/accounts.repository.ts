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

  getOneAccount(id: number) {
    const find = this.prisma.accounts.findUnique({
      where: { id },
    });

    if (!find) {
      return {
        message: 'Cannot Find Any ${id} Matching Record',
        status: 404,
        id: id,
      };
    }

    return find;
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

  async deleteAccount(id: number) {
    const deleted = await this.prisma.accounts.delete({
      where: { id },
    });

    if (deleted) {
      return {
        message: 'Record Deleted',
        status: 203,
        id: id,
      };
    }
    return {
      message: 'Cannot Delete ${id} Record',
      status: 404,
      id: id,
    };
  }

  async updateBalance(accountId: number, changeAmount: number) {
    return this.prisma.accounts.update({
      where: { id: accountId },
      data: { balance: { increment: changeAmount } },
    });
  }
}
