import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../..//prisma/prisma.service';
import { MailService } from '..//mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async getRecomendados(userId: number) {
    // 1) Primero obtén una lista de IDs de amigos del usuario actual
    const amistades = await this.prisma.amistad.findMany({
      where: {
        OR: [{ id_usuario_a: userId }, { id_usuario_b: userId }],
      },
    });

    const idsAmigos = amistades
      .flatMap((a) => [a.id_usuario_a, a.id_usuario_b])
      .filter((id) => id !== userId);

    // 2) Usa esos IDs para excluir amigos actuales de la recomendación
    return this.prisma.usuario.findMany({
      where: {
        id_usuario: {
          notIn: [userId, ...idsAmigos],
        },
      },
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: {
          select: { id_rol: true, nombre: true },
        },
      },
    });
  }

  async login(email: string, contraseña: string) {
    // 1. Busca usuario e incluye su rol
    const user = await this.prisma.usuario.findUnique({
      where: { email },
      include: { rol: true },
    });

    // 2. Si no existe o la password no coincide, error 401
    if (!user || !(await bcrypt.compare(contraseña, user.contraseña))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Preparamos payload con rol
    const payload = {
      sub: user.id_usuario,
      email: user.email,
      role: user.rol.nombre, // <— incluimos nombre del rol
      roleId: user.rol.id_rol, // <— opcional: su id_rol
    };

    // 4. Firmamos JWT
    const access_token = this.jwtService.sign(payload);

    // 5. Devolvemos token y datos básicos del usuario
    return {
      access_token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol, // { id_rol, nombre }
      },
    };
  }

  async register(nombre: string, email: string, contraseña: string) {
    // Determinamos el rol según la contraseña recibida
    const rolId = contraseña === 'ADMIN123' ? 1 : 2;

    // Hasheamos igual la contraseña (sea ADMIN123 o la real de un usuario normal)
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nombre,
        email,
        contraseña: hashedPassword,
        rol: { connect: { id_rol: rolId } },
      },
    });

    // Correo de bienvenida
    await this.mailService.sendMail(
      email,
      'Bienvenido a HALL',
      `Hola ${nombre}, gracias por registrarte en nuestra plataforma.`,
    );

    return { message: 'Usuario registrado exitosamente', user };
  }

  //no se utilizara pero lo dejo por si acaso
  async updateUser(
    id_usuario: number,
    data: { nombre?: string; email?: string; contraseña?: string },
  ) {
    if (data.contraseña) {
      data.contraseña = await bcrypt.hash(data.contraseña, 10); // Encripta la nueva contraseña si se proporciona
    }

    const updatedUser = await this.prisma.usuario.update({
      where: { id_usuario },
      data,
    });

    return { message: 'Usuario actualizado exitosamente', updatedUser };
  }

  async sendVerificationCode(email: string) {
    const verificationCode = crypto.randomInt(100000, 999999).toString(); // Genera un código de 6 dígitos

    // Guarda el código en la base de datos
    await this.prisma.usuario.update({
      where: { email },
      data: { codigo_verificacion: verificationCode },
    });

    // Envía el código al correo del usuario
    await this.mailService.sendMail(
      email,
      'Código de verificación para cambio de contraseña',
      `Tu código de verificación es: ${verificationCode}`,
    );

    return { message: 'Código de verificación enviado al correo' };
  }

  async verifyAndChangePassword(
    email: string,
    codigo: string,
    nuevaContraseña: string,
  ) {
    // Busca al usuario por email y verifica el código
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!user || user.codigo_verificacion !== codigo) {
      throw new Error(
        'Código de verificación inválido o usuario no encontrado',
      );
    }

    // Encripta la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    // Actualiza la contraseña y elimina el código de verificación
    await this.prisma.usuario.update({
      where: { email },
      data: {
        contraseña: hashedPassword,
        codigo_verificacion: null, // Limpia el código de verificación
      },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async updateUserName(id_usuario: number, nombre: string, contraseña: string) {
    if (!id_usuario || isNaN(id_usuario)) {
      throw new Error('ID de usuario inválido');
    }

    // Verifica si el usuario existe
    const user = await this.prisma.usuario.findUnique({
      where: { id_usuario },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verifica si la contraseña es correcta
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    // Actualiza solo el nombre del usuario
    const updatedUser = await this.prisma.usuario.update({
      where: { id_usuario },
      data: { nombre },
    });

    return { message: 'Nombre actualizado exitosamente', updatedUser };
  }
}
