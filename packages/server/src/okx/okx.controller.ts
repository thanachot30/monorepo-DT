/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OkxService } from './okx.service';
@Controller('okx')
export class OkxController {
  constructor(private readonly okxService: OkxService) {}
  @Get('/')
  async getLists() {
    const getList = await this.okxService.getList();
    return getList;
  }

  @Post('/:mainid')
  async getApiById(
    @Body() body: { userId: string },
    @Param('mainid') mainid: string
  ) {
    console.log(body.userId);
    const getById = await this.okxService.getApiById(mainid, body.userId);
    return getById;
  }
}
