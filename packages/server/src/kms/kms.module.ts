import { Module } from '@nestjs/common';
import { KmsService } from './kms.service';
import { KmsController } from './kms.controller';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule], // ⬅️ add this line
  controllers: [KmsController],
  providers: [KmsService],
  exports: [KmsService],
})
export class KmsModule {}
