import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('nombre') nombre: string,
    @Body('email') email: string,
    @Body('contraseña') contraseña: string,
  ) {
    return this.authService.register(nombre, email, contraseña);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('contraseña') contraseña: string,
  ) {
    return this.authService.login(email, contraseña);
  }

  @Post('send-verification-code')
  async sendVerificationCode(@Body('email') email: string) {
    return this.authService.sendVerificationCode(email);
  }

  @Patch('change-password')
  async changePassword(
    @Body('email') email: string,
    @Body('codigo') codigo: string,
    @Body('nuevaContraseña') nuevaContraseña: string,
  ) {
    return this.authService.verifyAndChangePassword(
      email,
      codigo,
      nuevaContraseña,
    );
  }

  @Patch('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: { nombre?: string; email?: string; contraseña?: string },
  ) {
    return this.authService.updateUser(Number(id), data);
  }

  @Patch('update-name/:id')
  async updateUserName(
    @Param('id') id: string,
    @Body('nombre') nombre: string,
    @Body('contraseña') contraseña: string,
  ) {
    if (!nombre || !contraseña) {
      throw new Error('El nombre y la contraseña son obligatorios');
    }

    const userId = Number(id);
    if (isNaN(userId)) {
      throw new Error('El ID del usuario debe ser un número válido');
    }

    return this.authService.updateUserName(userId, nombre, contraseña);
  }

  @UseGuards(AuthGuard('jwt')) // Protege el endpoint con JWT
  @Get('profile')
  async getProfile(@Req() req) {
    return req.user; // Devuelve la información del usuario autenticado
  }
}
