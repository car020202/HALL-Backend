import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService], // Exportamos el servicio para que otros módulos puedan usarlo
})
export class MailModule {}
