import { Controller, Post, Body, ParseIntPipe } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';

@Controller('transaccion')
export class TransaccionController {
  constructor(private readonly service: TransaccionService) {}

  @Post('venta')
  venta(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('keys') keysWithObj: Array<{ id_key: number }>, // recibimos objetos
    @Body('descripcion') descripcion?: string,
  ) {
    // los convertimos a un array de números
    const keyIds = keysWithObj.map((k) => k.id_key);

    return this.service.processSale({
      userId,
      keys: keyIds,
      descripcion,
    });
  }
}
