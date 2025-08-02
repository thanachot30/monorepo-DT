/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { User, createUser } from '@org/shared-model';

interface userProp {
  username: string;
  email: string;
}
interface deleteUserProp {
  id: string;
}
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async userList(): Promise<User[]> {
    return await this.userService.getUserLists();
  }

  @Post('/')
  async createUser(@Body() body: userProp) {
    const { username, email } = body;
    const isExist = await this.userService.IsExistsEmail(username);
    console.log(isExist);
    if (isExist) {
      throw new HttpException('Email is alreay exist', HttpStatus.BAD_REQUEST);
    }
    const userData: createUser = {
      username,
      email,
      affiliate: 'main',
    };
    console.log('createUser');
    const create = await this.userService.createUser(userData);

    return create;
  }

  @Post('/delete')
  async DeleteUser(@Body() body: deleteUserProp) {
    try {
      const { id } = body;
      const softDelete = await this.userService.DeleteUser(id);
      if (!softDelete) {
        return false;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
