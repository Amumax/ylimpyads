import { Injectable } from '@nestjs/common';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Major} from "./entities/major.entity";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

@Injectable()
export class MajorService extends TypeOrmCrudService<Major> {
  constructor(
    @InjectRepository(Major)
    private repository: Repository<Major>,
  ) {
    super(repository);
  }

  // create(createMajorDto: CreateMajorDto): Promise<Major> {
  //   return this.repository.save(createMajorDto);
  // }

  // findAll(): Promise<Major[]> {
  //   return this.repository.find();
  // }

  // findOne(id: number) : Promise<Major> {
  //   return this.repository.findOneBy({id});
  // }

  // update(id: number, updateMajorDto: UpdateMajorDto) : Promise<UpdateMajorDto> {
  //   return this.repository.update({id}, updateMajorDto).then(result => {
  //     if (result.affected > 0) {
  //       return updateMajorDto;
  //     } else
  //       return null;
  //   });
  // }

  // remove(id: number) : Promise<boolean> {
  //   return this.repository.delete(id).then(result => {
  //     return result.affected > 0;
  //   });
  // }
}
