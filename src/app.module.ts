import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolModule } from './rol/rol.module';
import { MailModule } from './mail/mail.module';
import { AmistadModule } from './amistad/amistad.module';
import { CategoriaJuegoModule } from './categoria-juego/categoria-juego.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { EstadoSolicitudModule } from './estado-solicitud/estado-solicitud.module';
import { SolicitudModule } from './solicitud/solicitud.module';
import { JuegoModule } from './juego/juego.module';
import { KeyModule } from './key/key.module';

@Module({
  imports: [
    AuthModule,
    RolModule,
    MailModule,
    AmistadModule,
    CategoriaJuegoModule,
    ProveedoresModule,
    EstadoSolicitudModule,
    SolicitudModule,
    JuegoModule,
    KeyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
