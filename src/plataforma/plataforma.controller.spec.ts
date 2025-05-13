import { Test, TestingModule } from '@nestjs/testing';
import { PlataformaController } from './plataforma.controller';

describe('PlataformaController', () => {
  let controller: PlataformaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlataformaController],
    }).compile();

    controller = module.get<PlataformaController>(PlataformaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
