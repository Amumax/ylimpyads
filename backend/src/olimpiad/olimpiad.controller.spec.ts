import { Test, TestingModule } from '@nestjs/testing';
import { OlimpiadController } from './olimpiad.controller';
import { OlimpiadService } from './olimpiad.service';

describe('OlimpiadController', () => {
  let controller: OlimpiadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OlimpiadController],
      providers: [OlimpiadService],
    }).compile();

    controller = module.get<OlimpiadController>(OlimpiadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
