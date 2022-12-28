import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {Events} from "./entities/event.entity";
import { Crud, CrudController, CrudRequest, CrudRequestInterceptor, ParsedRequest } from "@nestjsx/crud";
@ApiTags('event')
@Controller('events')
@Crud({
  model: {
    type: Events
  },
  query: {
    join: {
      olimpiad: {
        eager: false
      }
    }
  }
})
export class EventController implements CrudController<Events> {
  constructor(public service: EventService) {}

  @Get('/day/:day')
  async getEventsForDay(@Param() params) {
    return this.service.getDayDetails(params.day, params.day, []);
  }
}
