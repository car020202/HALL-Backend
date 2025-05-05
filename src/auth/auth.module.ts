import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // Importa la estrategia JWT
import { PrismaService } from '../../prisma/prisma.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY', // Cambia esto por una clave secreta segura
      signOptions: { expiresIn: '1h' },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy], // Agrega JwtStrategy aquí
})
export class AuthModule {}
