/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { OkxService } from './okx.service';
import type {
  accountConfig,
  saveApiVariableProp,
  deleteProp,
} from '@org/shared-model';
@Controller('okx')
export class OkxController {
  constructor(private readonly okxService: OkxService) {}
  @Get('/')
  async getLists() {
    const getList = await this.okxService.getList();
    return getList;
  }

  @Post(':mainid')
  async getApiById(
    @Body() body: { userId: string },
    @Param('mainid') mainid: string
  ) {
    // console.log(body.userId);
    const getById = await this.okxService.getApiById(mainid, body.userId);
    return getById;
  }

  @Post('/detail/:apiId')
  async getApiDetail(@Param('apiId') apiId: string) {
    const detail = await this.okxService.getDetail(apiId);
    return detail;
  }

  @Post('/check/config')
  async okxCheck(@Body() req: accountConfig) {
    const { apiKey, secretKey, passphrase } = req;
    console.log({ apiKey, secretKey, passphrase });
    const data = {
      apiKey,
      secretKey,
      passphrase,
    };
    const check = await this.okxService.checkConfig(data);
    return check;
  }

  @Post('/save')
  async saveApi(@Body() req: saveApiVariableProp) {
    const {
      userId,
      title,
      apiKey,
      secretKey,
      passphrase,
      strategy,
      relationToMain,
    } = req;

    const save = await this.okxService.saveApiVariable({
      userId,
      title,
      apiKey,
      secretKey,
      passphrase,
      strategy,
      relationToMain,
    });

    return save;
  }

  @Post()
  async DeleteApi(@Body() req: deleteProp) {
    const { id } = req;
    const softDelete = await this.okxService.Delete(id);
    return softDelete;
  }
}
