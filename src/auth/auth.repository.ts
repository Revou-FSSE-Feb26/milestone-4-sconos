import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // includes the password hash on purpose: AuthService needs it to
  // compare during login. Never return this object straight to a controller.
  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  createUser(dto: RegisterDto, hashedPassword: string) {
    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      },
      omit: { password: true },
    });
  }
}
