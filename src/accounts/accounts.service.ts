import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}
  getAllAccounts() {
    return this.accountsRepository.getAllAccounts();
  }

  getOneAccount(id: number) {
    return this.accountsRepository.getOneAccount(id);
  }

  createAccount(dto: CreateAccountDto) {
    return this.accountsRepository.createAccount(dto);
  }

  updateAccount(id: number, dto: UpdateAccountDto) {
    const account = this.accountsRepository.getOneAccount(id);

    if (!account) return new NotFoundException();

    return this.accountsRepository.updateAccount(id, dto);
  }

  deleteAccount(id: number) {
    const account = this.accountsRepository.getOneAccount(id);

    if (!account) return new NotFoundException();

    return this.accountsRepository.deleteAccount(id);
  }
}
