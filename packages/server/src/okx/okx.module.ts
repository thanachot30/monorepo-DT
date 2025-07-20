import { Module } from '@nestjs/common';
import { OkxController } from './okx.controller';
import { OkxService } from './okx.service';
import { KmsModule } from '../kms/kms.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule, KmsModule],
  controllers: [OkxController],
  providers: [OkxService],
})
export class OkxModule {}
