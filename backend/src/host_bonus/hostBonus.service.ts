import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HostBonus } from "./entities/hostBonus.entity";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

@Injectable()
export class HostBonusService extends TypeOrmCrudService<HostBonus> {
    constructor(
        @InjectRepository(HostBonus)
        private bonusRepo: Repository<HostBonus>,
    ) {
        super(bonusRepo)
    }
}
