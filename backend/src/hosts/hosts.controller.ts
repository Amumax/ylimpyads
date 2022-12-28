import {Controller, Get, Post, Body, Patch, Param, Delete, Render} from '@nestjs/common';
import { HostsService } from './hosts.service';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {Host} from "./entities/host.entity";
import { Crud, CrudController } from "@nestjsx/crud";

@ApiTags("host")
@Controller('hosts')
@Crud({
  model: {
    type: Host
  }
})
export class HostsController implements CrudController<Host> {
  constructor(public service: HostsService) {}
}
