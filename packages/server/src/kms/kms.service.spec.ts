import { Test, TestingModule } from '@nestjs/testing';
import { KmsService } from './kms.service';

describe('KmsService', () => {
  let service: KmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KmsService],
    }).compile();

    service = module.get<KmsService>(KmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
