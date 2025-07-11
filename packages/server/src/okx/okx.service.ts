import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@Injectable()
export class OkxService {
  async getList() {
    try {
      const getLists = await prisma.apiVariable.findMany({
        where: {
          strategy: 'main',
        },
        select: {
          id: true,
          title: true,
          userId: true,
        },
      });
      if (!getLists) return [];
      return getLists;
    } catch (error) {
      throw new HttpException('error:Delete User', HttpStatus.BAD_REQUEST);
    }
  }

  async getApiById(id: string, userId: string) {
    try {
      // 1. Get sub strategies where relationToMain = id
      const subItems = await prisma.apiVariable.findMany({
        where: {
          relationToMain: id,
          strategy: 'sub',
        },
        select: {
          id: true,
          strategy: true,
          title: true,
        },
      });

      // 2. Get main strategy where id = id
      const mainItem = await prisma.apiVariable.findMany({
        where: {
          id: id,
          strategy: 'main',
        },
        select: {
          id: true,
          strategy: true,
          title: true,
        },
      });

      // 3. Combine results (same as UNION ALL)
      const getById = [...mainItem, ...subItems];

      //Get user info

      const userInfo = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          username: true,
          email: true,
        },
      });
      if (!userInfo) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      return {
        data: getById,
        user: userInfo,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('error:getApiById User', HttpStatus.BAD_REQUEST);
    }
  }
}
