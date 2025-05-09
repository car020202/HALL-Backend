import { Test, TestingModule } from '@nestjs/testing';
import { JuegoService } from './juego.service';

describe('JuegoService', () => {
  let service: JuegoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JuegoService],
    }).compile();

    service = module.get<JuegoService>(JuegoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
