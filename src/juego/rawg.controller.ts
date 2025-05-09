import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { RawgService } from './rawg.service';

@Controller('juegos')
export class RawgController {
  constructor(private readonly rawg: RawgService) {}

  // GET /juegos?search=zelda&page=1&pageSize=20
  @Get()
  async search(
    @Query('search') search: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.rawg.searchGames(search, +page, +pageSize);
  }

  // GET /juegos/:id
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rawg.getGameById(id);
  }
}
