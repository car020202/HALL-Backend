import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private svc: ProveedoresService) {}

  @Post()
  create(
    @Body('nombre') nombre: string,
    @Body('contacto') contacto: string,
    @Body('correo') correo: string,
  ) {
    return this.svc.create({ nombre, contacto, correo });
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('nombre') nombre?: string,
    @Body('contacto') contacto?: string,
    @Body('correo') correo?: string,
  ) {
    return this.svc.update(id, { nombre, contacto, correo });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
