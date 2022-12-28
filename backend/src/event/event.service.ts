import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Events} from "./entities/event.entity";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { ScheduleDayDetailsDto } from 'src/olimpiad/dto/schedule.dto';

@Injectable()
export class EventService extends TypeOrmCrudService<Events>{
  constructor(
    @InjectRepository(Events)
    private repository: Repository<Events>,
  ) {
    super(repository)
  }
  getDayDetails(start: string, finish: string, olimpIds: number[]): Promise<ScheduleDayDetailsDto[]> {
    if (start == null)
      return Promise.reject('not found');
    if (olimpIds.length > 0)
      return this.repo.query(`SELECT to_char((d.the_day AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS "day"
      , o.name                as olimp, o.id as oid
      , a.name, a.start, a.finish
  FROM generate_series($1, $2, interval '1 day') d(the_day)
          CROSS JOIN (SELECT DISTINCT id FROM events) AS i
          CROSS JOIN LATERAL (
    SELECT olimpiad, name, finish, start
    FROM events a
    WHERE a.id = i.id
      AND a.start < d.the_day + interval '1 day'
      AND (a.finish >= d.the_day OR a.finish IS NULL)
      AND a.olimpiad in ($3)
    ORDER BY a.finish DESC
    LIMIT 1
    ) a left join olimpiads o on o.id = a.olimpiad order by o.id`, [start, finish == null ? start : finish])
    else
      return this.repo.query(`SELECT to_char((d.the_day AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS "day"
      , o.name                as olimp, o.id as oid
      , a.name, a.start, a.finish
  FROM generate_series(to_date($1,'YYYY-MM-DD'), to_date($2,'YYYY-MM-DD'), interval '1 day') d(the_day)
          CROSS JOIN (SELECT DISTINCT id FROM events) AS i
          CROSS JOIN LATERAL (
    SELECT olimpiad, name, finish, start
    FROM events a
    WHERE a.id = i.id
      AND a.start < d.the_day + interval '1 day'
      AND (a.finish >= d.the_day OR a.finish IS NULL)
    ORDER BY a.finish DESC
    LIMIT 1
    ) a left join olimpiads o on o.id = a.olimpiad order by o.id`, [start, finish == null ? start : finish])
  }
  // create(createHostDto: CreateEventDto): Promise<Events> {
  //   return this.repository.save(createHostDto);
  // }

  // findAll(): Promise<Events[]> {
  //   return this.repository.find();
  // }

  // findOne(id: number) : Promise<Events> {
  //   return this.repository.findOneBy({id});
  // }

  // update(id: number, updateHostDto: UpdateEventDto) : Promise<UpdateEventDto> {
  //   return this.repository.update({id}, updateHostDto).then(result => {
  //     if (result.affected > 0) {
  //       return updateHostDto;
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
