import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaJuegoService } from './categoria-juego.service';

describe('CategoriaJuegoService', () => {
  let service: CategoriaJuegoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaJuegoService],
    }).compile();

    service = module.get<CategoriaJuegoService>(CategoriaJuegoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
