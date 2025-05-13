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
import { PlataformaService } from './plataforma.service';

@Controller('plataforma')
export class PlataformaController {
  constructor(private readonly plataformaService: PlataformaService) {}

  @Post()
  create(@Body('nombre') nombre: string) {
    return this.plataformaService.create({ nombre });
  }

  @Get()
  findAll() {
    return this.plataformaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.plataformaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('nombre') nombre: string,
  ) {
    return this.plataformaService.update(id, { nombre });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.plataformaService.remove(id);
  }
}
