import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Profile} from "./entities/profile.entity";
import {Repository} from "typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

@Injectable()
export class ProfileService extends TypeOrmCrudService<Profile> {
  constructor(
    @InjectRepository(Profile)
    private repository: Repository<Profile>,
  ) {
    super(repository);
  }

//   create(createProfileDto: CreateProfileDto): Promise<Profile> {
//     return this.repository.save(createProfileDto);
//   }

//   findAll(): Promise<Profile[]> {
//     return this.repository.find();
//   }

//   findOne(id: number) : Promise<Profile> {
//     return this.repository.findOneBy({id});
//   }

//   update(id: number, updateProfileDto: UpdateProfileDto) : Promise<UpdateProfileDto> {
//     return this.repository.update({id}, updateProfileDto).then(result => {
//       if (result.affected > 0) {
//         return updateProfileDto;
//       } else
//         return null;
//     });
//   }

//   remove(id: number) : Promise<boolean> {
//     return this.repository.delete(id).then(result => {
//       return result.affected > 0;
//     });
//   }
}
