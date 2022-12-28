import { Injectable } from '@nestjs/common';
import { CreateHostDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Host} from "./entities/host.entity";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
@Injectable()
export class HostsService extends TypeOrmCrudService<Host> {
  constructor(
    @InjectRepository(Host)
    private hostRepository: Repository<Host>,
  ) {
    super(hostRepository);
  }

  // create(createHostDto: CreateHostDto): Promise<Host> {
  //   return this.hostRepository.save(createHostDto);
  // }

  // findAll(): Promise<Host[]> {
  //   return this.hostRepository.find();
  // }

  // findOne(id: number) : Promise<Host> {
  //   return this.hostRepository.findOneBy({id});
  // }

  // update(id: number, updateHostDto: UpdateHostDto) : Promise<UpdateHostDto> {
  //   return this.hostRepository.update({id}, updateHostDto).then(result => {
  //     if (result.affected > 0) {
  //       return updateHostDto;
  //     } else
  //       return null;
  //   });
  // }

  // remove(id: number) : Promise<boolean> {
  //   return this.hostRepository.delete(id).then(result => {
  //     return result.affected > 0;
  //   });
  // }
}
