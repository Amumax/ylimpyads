import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OlimpiadService } from './olimpiad.service';
import { OlimpiadController } from './olimpiad.controller';
import { Olimpiad } from './entities/olimpiad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Olimpiad])],
  controllers: [OlimpiadController],
  providers: [OlimpiadService]
})
export class OlimpiadModule {}
