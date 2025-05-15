import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransaccionService } from './transaccion.service';

@Controller('transaccion')
export class TransaccionController {
  constructor(private readonly service: TransaccionService) {}

  // === Compra de keys (admin) ===
  @Post('compra')
  @UseGuards(AuthGuard('jwt'))
  async compra(
    @Req() req,
    @Body('proveedorId', ParseIntPipe) proveedorId: number,
    @Body('juegoId', ParseIntPipe) juegoId: number,
    @Body('plataformaId', ParseIntPipe) plataformaId: number,
    @Body('cantidad', ParseIntPipe) cantidad: number,
    @Body('precioCompra') precioCompra: number,
    @Body('precioVenta') precioVenta: number,
    @Body('descripcion') descripcion?: string,
  ) {
    const adminId = req.user.id_usuario;
    return this.service.processPurchase({
      adminId,
      proveedorId,
      juegoId,
      plataformaId,
      cantidad,
      precioCompra,
      precioVenta,
      descripcion,
    });
  }

  // === Venta de keys (usuario) ===
  @Post('venta')
  async venta(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('keys') keysWithObj: Array<{ id_key: number }>,
    @Body('descripcion') descripcion?: string,
  ) {
    const keyIds = keysWithObj.map((k) => k.id_key);
    return this.service.processSale({
      userId,
      keys: keyIds,
      descripcion,
    });
  }
}
