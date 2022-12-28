import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { HostBonus } from "./entities/hostBonus.entity";
import { HostBonusController } from './hostBonus.controller';
import { HostBonusService } from './hostBonus.service';

@Module({
    imports: [TypeOrmModule.forFeature([HostBonus])],
    controllers: [HostBonusController],
    providers: [HostBonusService]
})
export class HostBonusModule { }
