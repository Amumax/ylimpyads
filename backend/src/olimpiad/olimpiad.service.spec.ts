import { Test, TestingModule } from '@nestjs/testing';
import { OlimpiadService } from './olimpiad.service';

describe('OlimpiadService', () => {
  let service: OlimpiadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OlimpiadService],
    }).compile();

    service = module.get<OlimpiadService>(OlimpiadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
