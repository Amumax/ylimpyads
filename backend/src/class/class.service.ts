import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Class} from "./entities/class.entity";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

@Injectable()
export class ClassService extends TypeOrmCrudService<Class> {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {
    super(classRepository)
  }
  // create(createClassDto: CreateClassDto) {
  //   return this.classRepository.save(createClassDto);
  // }

  // findAll() {
  //   return this.classRepository.find();
  // }

  // findOne(id: number) {
  //   return this.classRepository.findOneBy({id});
  // }

  // update(id: number, updateClassDto: UpdateClassDto) {
  //   return this.classRepository.update({id}, updateClassDto).then(result => {
  //     if (result.affected > 0) {
  //       return updateClassDto;
  //     } else
  //       return null;
  //   });
  // }

  // remove(id: number) {
  //   return this.classRepository.delete(id).then(result => {
  //     return result.affected > 0;
  //   });
  // }
}
