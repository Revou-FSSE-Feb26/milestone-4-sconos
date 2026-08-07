import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAllUsers() {
    return this.prisma.users.findMany();
  }

  getOneUser(id: number) {
    const find = this.prisma.users.findUnique({
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

  createUser(dto: CreateUserDto) {
    return this.prisma.users.create({
        data: { ...dto, role: dto.role ?? 'user' },
    });
  }

  updateUser(id: number, dto: UpdateUserDto) {
    return this.prisma.users.update({
      where: { id },
      data: dto,
    });
  }

  async deleteUser(id: number) {
    const deleted = await this.prisma.users.delete({
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
}
