import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HostBonusService } from './hostBonus.service';
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import { HostBonus} from "./entities/hostBonus.entity";
import { Crud, CrudController } from "@nestjsx/crud";

@ApiTags("hostBonus")
@Controller('hostBonus')
@Crud({
  model: {
    type: HostBonus
  }
})
export class HostBonusController implements CrudController<HostBonus> {
  constructor(public service: HostBonusService) {}
}
