import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BonusType } from "./entities/bonusType.entity";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

@Injectable()
export class BonusTypeService extends TypeOrmCrudService<BonusType> {
    constructor(
        @InjectRepository(BonusType)
        private bonusRepo: Repository<BonusType>,
    ) {
        super(bonusRepo)
    }
}
