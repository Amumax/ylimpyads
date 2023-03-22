import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Grade } from "./entities/grade.entity";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

@Injectable()
export class GradeService extends TypeOrmCrudService<Grade> {
    constructor(
        @InjectRepository(Grade)
        private bonusRepo: Repository<Grade>,
    ) {
        super(bonusRepo)
    }
}
