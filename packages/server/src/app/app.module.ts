import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { OkxModule } from '../okx/okx.module';
import { KmsModule } from '../kms/kms.module';
@Module({
  imports: [UserModule, OkxModule, KmsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
