import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor, Req
} from '@nestjs/common';
import { OlimpiadService } from './olimpiad.service';
import { CreateOlimpiadDto } from './dto/create-olimpiad.dto';
import { UpdateOlimpiadDto } from './dto/update-olimpiad.dto';
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { Olimpiad } from "./entities/olimpiad.entity";
import {Crud, CrudController, CrudRequest, CrudRequestInterceptor, ParsedRequest} from "@nestjsx/crud";

@ApiTags("olimpiad")
@Controller('olimpiads')
@Crud({
  model: {
    type: Olimpiad
  },
  query: {
    join: {
      host: {
        eager: false
      },
      class: {
        eager: false
      },
      profile: {
        eager: false
      },
      // event: {
      //   eager: true
      // }
    }
  }
})
export class OlimpiadController implements CrudController<Olimpiad> {
  constructor(public service: OlimpiadService) {}

  @UseInterceptors(CrudRequestInterceptor)
  @Get('/schedule')
  async getSchedule(@ParsedRequest() req: CrudRequest) {
    console.log(req.parsed.filter);
    const start = req.parsed.filter.find(element => element.field == 'start');
    const finish = req.parsed.filter.find(element => element.field == 'finish');
    const olimps = req.parsed.filter.find(element => element.field == 'olimps');
    console.log(olimps);
    return this.service.getSchedule(
      start == null ? '2022-09-01' : start.value, 
      finish == null ? '2023-06-01' : finish.value,
      olimps == null ? [] : olimps.value);
  }

  @UseInterceptors(CrudRequestInterceptor)
  @Get('/schedule/events')
  async getScheduleDetailed(@ParsedRequest() req: CrudRequest) {
    const start = req.parsed.filter.find(element => element.field == 'start');
    const finish = req.parsed.filter.find(element => element.field == 'finish');
    const olimps = req.parsed.filter.find(element => element.field == 'olimps');
    return this.service.getScheduleDetails(
      start == null ? '2022-09-01' : start.value, 
      finish == null ? '2023-06-01' : finish.value,
      olimps == null ? [] : olimps.value);
  }

  // @UseInterceptors(CrudRequestInterceptor)
  @Get('/forClass/:class')
  async getForClass(@Req() req) {
    return this.service.getForClass(req.params.class, req.query.grade);
  }
  @UseInterceptors(CrudRequestInterceptor)
  @Get('/forClass')
  async getAllForClass(@ParsedRequest() req: CrudRequest) {
    return this.service.getMany(req);
  }

}
