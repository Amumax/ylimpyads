import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {Class} from "./entities/class.entity";
import { Crud, CrudController } from "@nestjsx/crud";

@ApiTags("class")
@Controller('classes')
@Crud({
  model: {
    type: Class
  }
})
export class ClassController implements CrudController<Class> {
  constructor(public service: ClassService) {}
}
