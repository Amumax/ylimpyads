import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MajorService } from './major.service';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {Major} from "./entities/major.entity";
import { Crud, CrudController } from "@nestjsx/crud";
@ApiTags('major')
@Controller('majors')
@Crud({
  model: {
    type: Major
  }
})
export class MajorController implements CrudController<Major> {
  constructor(public service: MajorService) {}
}
