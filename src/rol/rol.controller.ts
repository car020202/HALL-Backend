import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolService } from './rol.service';

@Controller('rol')
export class RolController {
  constructor(private rolService: RolService) {}

  @Post('create')
  async createRol(@Body('nombre') nombre: string) {
    return this.rolService.createRol(nombre);
  }

  @Get()
  async getRoles() {
    return this.rolService.getRoles();
  }
}
