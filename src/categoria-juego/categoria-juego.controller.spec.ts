import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaJuegoController } from './categoria-juego.controller';

describe('CategoriaJuegoController', () => {
  let controller: CategoriaJuegoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaJuegoController],
    }).compile();

    controller = module.get<CategoriaJuegoController>(CategoriaJuegoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
