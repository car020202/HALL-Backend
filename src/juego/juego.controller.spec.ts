import { Test, TestingModule } from '@nestjs/testing';
import { JuegoController } from './juego.controller';

describe('JuegoController', () => {
  let controller: JuegoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JuegoController],
    }).compile();

    controller = module.get<JuegoController>(JuegoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
