import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GradeService } from './grade.service';
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import { Grade } from "./entities/grade.entity";
import { Crud, CrudController } from "@nestjsx/crud";

@ApiTags("grade")
@Controller('grade')
@Crud({
  model: {
    type: Grade
  }
})
export class GradeController implements CrudController<Grade> {
  constructor(public service: GradeService) {}
}
