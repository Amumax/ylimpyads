import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BonusTypeService } from './bonusType.service';
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {BonusType} from "./entities/bonusType.entity";
import { Crud, CrudController } from "@nestjsx/crud";

@ApiTags("bonusType")
@Controller('bonusType')
@Crud({
  model: {
    type: BonusType
  }
})
export class BonusTypeController implements CrudController<BonusType> {
  constructor(public service: BonusTypeService) {}
}
