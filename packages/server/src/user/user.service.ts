import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { User, createUser } from '@org/shared-model';
const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async getUserLists(): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        isDelete: false,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  }

  async IsExistsEmail(_username: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        username: _username,
      },
    });
    if (!user) {
      return false;
    }

    return false;
  }

  async createUser(_data: createUser) {
    try {
      const { username, email } = _data;
      const create = await prisma.user.create({
        data: {
          username: username,
          email: email,
          affiliate: 'main',
          createdAt: new Date(), // 👈 current timestamp
          isDelete: false,
          createdBy: 'pp',
        },
      });
      return create;
    } catch (error) {
      //  Block of code to handle errors
      throw new HttpException('error:Create User', HttpStatus.BAD_REQUEST);
    }
    return;
  }

  async DeleteUser(id: string) {
    try {
      const Softdelete = await prisma.user.update({
        where: {
          id,
        },
        data: {
          isDelete: true,
        },
      });

      return Softdelete;
    } catch (error) {
      throw new HttpException('error:Delete User', HttpStatus.BAD_REQUEST);
    }
  }
}
