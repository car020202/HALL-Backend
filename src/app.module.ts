import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <-- Importa ConfigModule

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
import { PlataformaModule } from './plataforma/plataforma.module';
import { BibliotecaDetalleModule } from './biblioteca-detalle/biblioteca-detalle.module';
import { BibliotecaModule } from './biblioteca/biblioteca.module';
import { TransaccionModule } from './transaccion/transaccion.module';

@Module({
  imports: [
    // 1) Carga todas las vars de .env en process.env y las hace accesibles globalmente
    ConfigModule.forRoot({ isGlobal: true }),

    // 2) Tus módulos existentes
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
    PlataformaModule,
    BibliotecaDetalleModule,
    BibliotecaModule,
    TransaccionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
