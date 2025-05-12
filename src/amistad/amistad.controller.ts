import {
  Controller,
  Get,
  Post,
  Delete,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id_amigo')
  async deleteAmistad(
    @Req() req,
    @Param('id_amigo', ParseIntPipe) id_amigo: number,
  ) {
    const id_usuario_a = req.user.sub; // tu ID viene en el payload JWT
    const id_usuario_b = id_amigo;

    if (id_usuario_a === id_usuario_b) {
      throw new BadRequestException('No podés eliminarte a vos mismo');
    }

    return this.amistadService.deleteAmistad(id_usuario_a, id_usuario_b);
  }
}
