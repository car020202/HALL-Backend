import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaDetalleController } from './biblioteca-detalle.controller';

describe('BibliotecaDetalleController', () => {
  let controller: BibliotecaDetalleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BibliotecaDetalleController],
    }).compile();

    controller = module.get<BibliotecaDetalleController>(BibliotecaDetalleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
