import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { BonusType } from "./entities/bonusType.entity";
import { BonusTypeController } from './bonusType.controller';
import { BonusTypeService } from './bonusType.service';

@Module({
    imports: [TypeOrmModule.forFeature([BonusType])],
    controllers: [BonusTypeController],
    providers: [BonusTypeService]
})
export class BonusTypeModule { }
