import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAllUsers() {
    return this.prisma.user.findMany();
  }

  async getOneUser(id: number) {
    const find = await this.prisma.user.findUnique({ where: { id } });
    if (!find) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return find;
  }

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: { ...dto, password: hashedPassword, role: dto.role ?? 'user' },
    });
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    await this.getOneUser(id); // reuse for existence check -> throws 404 if missing
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async deleteUser(id: number) {
    await this.getOneUser(id); // throws 404 if missing
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Record deleted', status: 200, id };
  }
}