import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { KeyService } from './key.service';

@Controller('key')
export class KeyController {
  constructor(private readonly keyService: KeyService) {}

  @Get('platforms/counts')
  countAllByPlatform() {
    return this.keyService.countAllByPlatform();
  }

  @Get('counts/juego')
  countKeysByJuego() {
    return this.keyService.countKeysByJuego();
  }

  @Get('platform/:id')
  findByPlatform(@Param('id', ParseIntPipe) id_plataforma: number) {
    return this.keyService.findByPlatform(id_plataforma);
  }

  @Post()
  create(
    @Body('id_juego', ParseIntPipe) id_juego: number,
    @Body('key') keyStr: string,
    @Body('id_estado_key', ParseIntPipe) id_estado_key: number,
    @Body('id_proveedor', ParseIntPipe) id_proveedor: number,
    @Body('id_plataforma', ParseIntPipe) id_plataforma: number,
    @Body('precioCompra') precioCompra: number,
    @Body('precioVenta') precioVenta: number,
  ) {
    return this.keyService.create({
      id_juego,
      key: keyStr,
      id_estado_key,
      id_proveedor,
      id_plataforma,
      precioCompra,
      precioVenta,
    });
  }

  @Get()
  findAll() {
    return this.keyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.keyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    data: {
      key?: string;
      id_estado_key?: number;
      id_proveedor?: number;
      id_plataforma?: number;
      precioCompra?: number;
      precioVenta?: number;
    },
  ) {
    return this.keyService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.keyService.delete(id);
  }

  @Post('filtrar-precio')
  findByPrecio(@Body('precio') precio: number) {
    return this.keyService.findByPrecio(precio);
  }
  @Get('estado/:id')
  findByEstado(
    @Param('id', ParseIntPipe) id: number,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.keyService.findByEstado(
      id,
      Number(skip) || 0,
      Number(take) || 100,
    );
  }
}
