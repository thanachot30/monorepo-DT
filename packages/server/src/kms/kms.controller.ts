import { Controller, Post, Body } from '@nestjs/common';
import { KmsService } from './kms.service';

interface EncryptRequestDto {
  text: string;
}

@Controller('kms')
export class KmsController {
  constructor(private readonly kmsService: KmsService) {}

  @Post('/encrypt')
  async encryptData(@Body() req: EncryptRequestDto) {
    const encrypted = await this.kmsService.encrypt(req.text);
    return { encrypted };
  }

  @Post('/decrypt')
  async decryptData(@Body() req: EncryptRequestDto) {
    const decrypted = await this.kmsService.decrypt(req.text);
    return { decrypted };
  }
}
