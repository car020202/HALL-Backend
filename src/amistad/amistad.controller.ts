import {
  Body,
  Controller,
  Post,
  Delete,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { AmistadService } from './amistad.service';

@Controller('amistad')
export class AmistadController {
  constructor(private amistadService: AmistadService) {}

  @Get(':id_usuario')
  async getAmistades(@Param('id_usuario', ParseIntPipe) id_usuario: number) {
    return this.amistadService.getAmistades(id_usuario);
  }

  @Post('create')
  async createAmistad(
    @Body('id_usuario_a') id_usuario_a: number,
    @Body('id_usuario_b') id_usuario_b: number,
  ) {
    return this.amistadService.createAmistad(id_usuario_a, id_usuario_b);
  }

  @Delete('delete')
  async deleteAmistad(
    @Body('id_usuario_a') id_usuario_a: number,
    @Body('id_usuario_b') id_usuario_b: number,
  ) {
    return this.amistadService.deleteAmistad(id_usuario_a, id_usuario_b);
  }
}
