import { Test, TestingModule } from '@nestjs/testing';
import { OkxController } from './okx.controller';

describe('OkxController', () => {
  let controller: OkxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OkxController],
    }).compile();

    controller = module.get<OkxController>(OkxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
