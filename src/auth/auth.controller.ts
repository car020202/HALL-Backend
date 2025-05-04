import { Body, Controller, Post } from '@nestjs/common';
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
}
