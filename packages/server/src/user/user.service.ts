import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { User } from '@org/shared-model';
const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async getUserLists(): Promise<User[]> {
    return await prisma.user.findMany();
  }
}
