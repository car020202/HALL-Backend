import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { AmistadService } from './amistad.service';

@Controller('amistad')
export class AmistadController {
  constructor(private readonly amistadService: AmistadService) {}

  @Post()
  async createAmistad(
    @Body('id_usuario_a') id_usuario_a: number,
    @Body('id_usuario_b') id_usuario_b: number,
  ) {
    return this.amistadService.createAmistad(id_usuario_a, id_usuario_b);
  }
}
