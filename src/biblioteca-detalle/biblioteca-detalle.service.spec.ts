import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaDetalleService } from './biblioteca-detalle.service';

describe('BibliotecaDetalleService', () => {
  let service: BibliotecaDetalleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BibliotecaDetalleService],
    }).compile();

    service = module.get<BibliotecaDetalleService>(BibliotecaDetalleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
