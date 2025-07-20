import { Test, TestingModule } from '@nestjs/testing';
import { KmsController } from './kms.controller';
import { KmsService } from './kms.service';

describe('KmsController', () => {
  let controller: KmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KmsController],
      providers: [KmsService],
    }).compile();

    controller = module.get<KmsController>(KmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
