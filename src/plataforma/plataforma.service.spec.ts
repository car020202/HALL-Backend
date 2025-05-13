import { Test, TestingModule } from '@nestjs/testing';
import { PlataformaService } from './plataforma.service';

describe('PlataformaService', () => {
  let service: PlataformaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlataformaService],
    }).compile();

    service = module.get<PlataformaService>(PlataformaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
