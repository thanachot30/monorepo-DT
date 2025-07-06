import { Controller, Get } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { User } from '@org/shared-model';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async userList(): Promise<User[]> {
    return await this.userService.getUserLists();
  }
}
