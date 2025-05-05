import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolModule } from './rol/rol.module';
import { MailModule } from './mail/mail.module';
import { AmistadModule } from './amistad/amistad.module';

@Module({
  imports: [AuthModule, RolModule, MailModule, AmistadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
