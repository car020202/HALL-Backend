import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../..//prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, contraseña: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(contraseña, user.contraseña))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id_usuario, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async register(nombre: string, email: string, contraseña: string) {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nombre,
        email,
        contraseña: hashedPassword,
        rol: {
          connect: { id_rol: 2 }, //2 para usuarios normales
        },
      },
    });

    return { message: 'Usuario registrado exitosamente', user };
  }
}
