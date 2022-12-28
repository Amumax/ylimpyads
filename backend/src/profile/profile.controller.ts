import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import {Profile} from "./entities/profile.entity";
import { Crud, CrudController } from "@nestjsx/crud";

@ApiTags('profile')
@Controller('profiles')
@Crud({
  model: {
    type: Profile
  }
})
export class ProfileController implements CrudController<Profile> {
  constructor(public service: ProfileService) {}
}
