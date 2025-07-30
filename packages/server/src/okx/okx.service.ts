import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { checkConfig, saveApiVariableProp, maskData } from '@org/shared-model';
import * as crypto from 'crypto';
import axios from 'axios';
import { KmsService } from '../kms/kms.service';
const prisma = new PrismaClient();
@Injectable()
export class OkxService {
  constructor(private readonly kmsService: KmsService) {}
  private baseURL = 'https://www.okx.com';

  private generateSignature(
    method: string,
    endpoint: string,
    body = '',
    secretKey: string
  ) {
    const timestamp = new Date().toISOString();
    const bodyStr = method === 'GET' ? '' : JSON.stringify(body);
    const prehashString = `${timestamp}${method.toUpperCase()}${endpoint}${bodyStr}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(prehashString)
      .digest('base64');
    return { signature, timestamp };
  }

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

  async getApiById(mainId: string, userId: string) {
    try {
      // 1. Get sub strategies where relationToMain = id
      const subItems = await prisma.apiVariable.findMany({
        where: {
          relationToMain: mainId,
          strategy: 'sub',
          isDelete: false,
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
          id: mainId,
          strategy: 'main',
          isDelete: false,
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
          id: true,
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

  async getRawVariable(apiId: string) {
    try {
      const variable = await prisma.apiVariable.findFirst({
        where: {
          id: apiId,
        },
        select: {
          variable: true,
        },
      });
      return variable;
    } catch (error) {
      throw new HttpException('error:getRawVariable', HttpStatus.BAD_REQUEST);
    }
  }

  async getDetail(apiId: string) {
    try {
      const detail = await prisma.apiVariable.findFirst({
        where: {
          id: apiId,
        },
        select: {
          id: true,
          userId: true,
          strategy: true,
          title: true,
          dataMarking: true,
        },
      });

      if (!detail) {
        throw new HttpException('detail not found', HttpStatus.BAD_REQUEST);
      }

      return detail;
    } catch (error) {
      throw new HttpException('error:getDetail', HttpStatus.BAD_REQUEST);
    }
  }

  async checkConfig(_data: checkConfig): Promise<boolean> {
    try {
      const { secretKey, apiKey, passphrase } = _data;
      const endpoint = '/api/v5/account/config';
      const method = 'GET';
      const { signature, timestamp } = this.generateSignature(
        method,
        endpoint,
        '',
        secretKey
      );
      const headers = {
        'OK-ACCESS-KEY': apiKey,
        'OK-ACCESS-SIGN': signature,
        'OK-ACCESS-TIMESTAMP': timestamp,
        'OK-ACCESS-PASSPHRASE': passphrase,
        'Content-Type': 'application/json',
      };
      const { data } = await axios.get(`${this.baseURL}${endpoint}`, {
        headers,
      });
      console.log('✅ Headers are valid:', data);
      return true;
    } catch (error) {
      throw new HttpException(
        `Error CheckConfig: ${error} `,
        HttpStatus.BAD_REQUEST
      );
      return false;
    }
  }

  async DecryptKMS(data: string) {
    try {
      const decrypt = await this.kmsService.decrypt(data);
      return decrypt;
    } catch (error) {
      throw new HttpException(
        `Error DecodeKMS: ${error} `,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async EncodeKMS(data: string) {
    try {
      const encrypt = await this.kmsService.encrypt(data);
      return encrypt;
    } catch (error) {
      throw new HttpException(
        `Error EncodeKMS: ${error} `,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async saveApiVariable(_data: saveApiVariableProp) {
    try {
      const {
        userId,
        title,
        apiKey,
        secretKey,
        passphrase,
        strategy,
        relationToMain,
      } = _data;
      //encrypt data
      const apiKey_encrypt = await this.kmsService.encrypt(apiKey);
      const secretKey_encrypt = await this.kmsService.encrypt(secretKey);
      const passphrase_encrypt = await this.kmsService.encrypt(passphrase);
      //masking data

      const apiKey_mask = this.kmsService.maskMiddleFixed(apiKey);
      const secretKey_mask = this.kmsService.maskMiddleFixed(secretKey);
      const passphrase_mask =
        this.kmsService.maskAllExceptFirstAndLast4(passphrase);
      console.log({ apiKey_mask, secretKey_mask, passphrase_mask });
      const variableMarking = {
        apiKey_mask,
        secretKey_mask,
        passphrase_mask,
      };
      const variableJson = {
        apiKey: apiKey_encrypt,
        secretKey: secretKey_encrypt,
        passphrase: passphrase_encrypt,
      };
      console.log({ strategy, relationToMain });
      const save = await prisma.apiVariable.create({
        data: {
          userId: userId,
          title: title,
          variable: variableJson,
          platform: 'okx',
          strategy: strategy, // or 'sub'
          relationToMain: strategy === 'main' ? null : relationToMain, // or another UUID if 'sub'
          dataMarking: variableMarking,
        },
      });

      return save;
    } catch (error) {
      throw new HttpException(
        `Error saveApiVariable: ${error} `,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async Delete(_id: string) {
    try {
      await prisma.apiVariable.update({
        where: { id: _id },
        data: { isDelete: true },
      });
      return true;
    } catch (error) {
      throw new HttpException(
        `Error Delete Variable: ${error} `,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  update(
    id: string,
    title?: string,
    variableKey?: checkConfig,
    masked?: maskData
  ) {
    try {
      const data: any = {};
      if (title !== undefined) {
        data.title = title;
      }
      if (variableKey !== undefined) {
        data.variable = variableKey;
      }
      if (masked !== undefined) {
        data.dataMarking = masked;
      }
      console.log({ data });
      const update = prisma.apiVariable.update({
        where: { id: id },
        data,
        select: {
          id: true,
          userId: true,
          strategy: true,
          title: true,
          dataMarking: true,
        },
      });
      return update;
    } catch (error) {
      throw new HttpException(
        `Error update: ${error} `,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  maskMiddleFixed(data: string) {
    try {
      const masked = this.kmsService.maskMiddleFixed(data);
      return masked;
    } catch (error) {
      throw new HttpException(
        `Error maskMiddleFixed: ${error} `,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  maskAllExceptFirstAndLast4(data: string) {
    try {
      const masked = this.kmsService.maskAllExceptFirstAndLast4(data);
      return masked;
    } catch (error) {
      throw new HttpException(
        `Error maskAllExceptFirstAndLast4: ${error} `,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
