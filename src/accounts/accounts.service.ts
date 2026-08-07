import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  getAllAccounts(userId: number) {
    return this.accountsRepository.getAllAccountsForUser(userId);
  }

  async getOneAccount(id: number, userId: number) {
    const account = await this.accountsRepository.getOneAccount(id);

    if (!account) throw new NotFoundException(`Account with ID ${id} not found`);
    if (account.user_id !== userId) throw new ForbiddenException();

    return account;
  }

  createAccount(dto: CreateAccountDto, userId: number) {
    return this.accountsRepository.createAccount({ ...dto, user_id: userId });
  }

  async updateAccount(id: number, dto: UpdateAccountDto, userId: number) {
    const account = await this.accountsRepository.getOneAccount(id);

    if (!account) throw new NotFoundException(`Account with ID ${id} not found`);
    if (account.user_id !== userId) throw new ForbiddenException();

    return this.accountsRepository.updateAccount(id, dto);
  }

  async deleteAccount(id: number, userId: number) {
    const account = await this.accountsRepository.getOneAccount(id);

    if (!account) throw new NotFoundException(`Account with ID ${id} not found`);
    if (account.user_id !== userId) throw new ForbiddenException();

    return this.accountsRepository.deleteAccount(id);
  }
}