import { Test, TestingModule } from '@nestjs/testing';
import { EstadoSolicitudController } from './estado-solicitud.controller';

describe('EstadoSolicitudController', () => {
  let controller: EstadoSolicitudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadoSolicitudController],
    }).compile();

    controller = module.get<EstadoSolicitudController>(EstadoSolicitudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
