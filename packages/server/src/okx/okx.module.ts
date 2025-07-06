import { Module } from '@nestjs/common';
import { OkxController } from './okx.controller';
import { OkxService } from './okx.service';

@Module({
  controllers: [OkxController],
  providers: [OkxService]
})
export class OkxModule {}
