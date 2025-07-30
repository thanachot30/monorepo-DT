/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OkxService } from './okx.service';
import type {
  accountConfig,
  saveApiVariableProp,
  deleteProp,
  editSub,
  checkConfig,
  maskData,
} from '@org/shared-model';
@Controller('okx')
export class OkxController {
  constructor(private readonly okxService: OkxService) {}
  @Get('/')
  async getLists() {
    const getList = await this.okxService.getList();
    return getList;
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

  @Post('/edit')
  async editApi(@Body() req: editSub) {
    const { id, title, apiKey, secretKey, passphrase } = req;
    let variableForUpdate: checkConfig | undefined = undefined;
    let maskedForUpdate: maskData | undefined = undefined;
    if (!id) throw new HttpException('Missing ID', HttpStatus.BAD_REQUEST);

    const updateData: Record<string, string> = {};
    if (title?.trim()) updateData.title = title.trim();
    if (apiKey?.trim()) updateData.apiKey = apiKey.trim();
    if (secretKey?.trim()) updateData.secretKey = secretKey.trim();
    if (passphrase?.trim()) updateData.passphrase = passphrase.trim();

    const updatingConfig = apiKey || secretKey || passphrase;
    console.log(updatingConfig);
    if (updatingConfig) {
      type VariableSecretConfig = {
        apiKey: string;
        secretKey: string;
        passphrase: string;
      };

      const getRawVariable = await this.okxService.getRawVariable(id);
      const variable = getRawVariable?.variable as VariableSecretConfig;
      if (!variable)
        throw new HttpException('No found Variable', HttpStatus.BAD_REQUEST);
      const apiKey = await this.okxService.DecryptKMS(variable.apiKey);
      const secretKey = await this.okxService.DecryptKMS(variable.secretKey);
      const passphrase = await this.okxService.DecryptKMS(variable.passphrase);

      console.log({ apiKey, secretKey, passphrase });
      console.log({ updateData });
      const newVariable: checkConfig = {
        apiKey: updateData.apiKey ?? apiKey,
        secretKey: updateData.secretKey ?? secretKey,
        passphrase: updateData.passphrase ?? passphrase,
      };
      console.log({ newVariable });
      const isValid = await this.okxService.checkConfig(newVariable);
      if (!isValid) {
        throw new HttpException(
          'Invalid API configuration',
          HttpStatus.BAD_REQUEST
        );
      }
      //Encrypt data
      const apiKey_encrypt = await this.okxService.EncodeKMS(
        newVariable.apiKey
      );
      const secretKey_encrypt = await this.okxService.EncodeKMS(
        newVariable.secretKey
      );
      const passphrase_encrypt = await this.okxService.EncodeKMS(
        newVariable.passphrase
      );
      //Masking Data
      const apiKey_mask = this.okxService.maskMiddleFixed(newVariable.apiKey);
      const secretKey_mask = this.okxService.maskMiddleFixed(
        newVariable.secretKey
      );
      const passphrase_mask = this.okxService.maskAllExceptFirstAndLast4(
        newVariable.passphrase
      );
      //
      variableForUpdate = {
        apiKey: apiKey_encrypt,
        secretKey: secretKey_encrypt,
        passphrase: passphrase_encrypt,
      };
      maskedForUpdate = {
        apiKey_mask: apiKey_mask,
        secretKey_mask: secretKey_mask,
        passphrase_mask: passphrase_mask,
      };
    }

    if (Object.keys(updateData).length === 0) {
      throw new HttpException('No fields to update', HttpStatus.BAD_REQUEST);
    }
    //
    const update = await this.okxService.update(
      id,
      updateData.title,
      variableForUpdate,
      maskedForUpdate
    );
    console.log({ update });
    return update;
  }

  @Post()
  async DeleteApi(@Body() req: deleteProp) {
    const { id } = req;
    const softDelete = await this.okxService.Delete(id);
    return softDelete;
  }

  @Post('/:mainid')
  async getApiById(
    @Body() body: { userId: string },
    @Param('mainid') mainid: string
  ) {
    // console.log(body.userId);
    const getById = await this.okxService.getApiById(mainid, body.userId);
    return getById;
  }
}
