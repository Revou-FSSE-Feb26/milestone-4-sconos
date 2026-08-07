import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getAllUsers() {
    return this.usersRepository.getAllUsers();
  }

  getOneUser(id: number) {
    return this.usersRepository.getOneUser(id);
  }

  createUser(dto: CreateUserDto) {
    return this.usersRepository.createUser(dto);
  }

  updateUser(id: number, dto: UpdateUserDto) {
    const user = this.usersRepository.getOneUser(id);

    if (!user) return new NotFoundException();

    return this.usersRepository.updateUser(id, dto);
  }

  deleteUser(id: number) {
    const user = this.usersRepository.getOneUser(id);

    if (!user) return new NotFoundException();

    return this.usersRepository.deleteUser(id);
  }
}
