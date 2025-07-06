import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { OkxModule } from '../okx/okx.module';
@Module({
  imports: [UserModule, OkxModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
