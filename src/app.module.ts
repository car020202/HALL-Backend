import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolModule } from './rol/rol.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AuthModule, RolModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
