import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Olimpiad } from './entities/olimpiad.entity';
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { ScheduleDetailedDto, ScheduleDto } from './dto/schedule.dto';

@Injectable()
export class OlimpiadService extends TypeOrmCrudService<Olimpiad> {
  constructor(
    @InjectRepository(Olimpiad)
    private olimpiadRepository: Repository<Olimpiad>,
  ) {
    super(olimpiadRepository);
  }
  getForClass(classId: number) : Promise<Olimpiad[]> {
    return this.repo.createQueryBuilder("olimpiad")
        .leftJoin("olimpiad.class", "class")
        .where("olimpiad_class.class = :class", { class: classId})
        .getMany()
  }
  getSchedule(start: Date, finish: Date, olimpIds: number[]): Promise<ScheduleDto> {
    if (start == null) {
      start = new Date('2022-09-01')
    }
    if (finish == null) {
      finish = new Date('2023-06-01')
    }
    if (olimpIds.length > 0)
      return this.repo.query(`SELECT to_char((d.the_day AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS "day"
      , array_agg(o.name)                as olimps
      , count(a.olimpiad)                as value
      FROM generate_series($1, $2, interval '1 day') d(the_day)
          CROSS JOIN (SELECT DISTINCT id FROM events) AS i
          CROSS JOIN LATERAL (
    SELECT olimpiad
    FROM events a
    WHERE a.id = i.id
      AND a.start < d.the_day + interval '1 day'
      AND (a.finish >= d.the_day OR a.finish IS NULL)
      AND a.olimpiad::text = any(string_to_array($3,','))
    ORDER BY a.finish DESC
    LIMIT 1
    ) a
    left join olimpiads o on o.id = a.olimpiad
    GROUP BY d.the_day
    ORDER BY d.the_day;`, [start, finish, olimpIds.map(r => r.toString()).join(',')]);
    else
      return this.repo.query(`SELECT to_char((d.the_day AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS "day"
    , array_agg(o.name)                as olimps
    , count(a.olimpiad)                    as value
  FROM generate_series($1, $2, interval '1 day') d(the_day)
        CROSS JOIN (SELECT DISTINCT id FROM events) AS i
        CROSS JOIN LATERAL (
  SELECT olimpiad
  FROM events a
  WHERE a.id = i.id
    AND a.start < d.the_day + interval '1 day'
    AND (a.finish >= d.the_day OR a.finish IS NULL)
  ORDER BY a.finish DESC
  LIMIT 1
  ) a
  left join olimpiads o on o.id = a.olimpiad
  GROUP BY d.the_day
  ORDER BY d.the_day;`, [start, finish]);
  }

  getScheduleDetails(start: Date, finish: Date, olimpIds: number[]): Promise<ScheduleDetailedDto> {
    if (start == null) {
      start = new Date('2022-09-01')
    }
    if (finish == null) {
      finish = new Date('2023-06-01')
    }
    if (olimpIds.length > 0)
      return this.repo.query(`SELECT to_char((d.the_day AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS "day"
      , a.olimpiad
      , count(a.olimpiad) AS value
      , array_agg(i.id) AS ids
FROM   generate_series($1, $2, interval    '1 day') d(the_day)
            CROSS  JOIN (SELECT DISTINCT id FROM events) AS i
            CROSS  JOIN LATERAL (
    SELECT olimpiad
    FROM   events a
    WHERE  a.id = i.id
      AND    a.start <  d.the_day + interval '1 day'
      AND   (a.finish   >= d.the_day OR a.finish IS NULL)
      AND    a.olimpiad::text = any(string_to_array($3,','))
    ORDER  BY a.finish DESC
    LIMIT  1
    ) a
GROUP  BY d.the_day, a.olimpiad
ORDER  BY d.the_day, a.olimpiad`, [start, finish, olimpIds.map(r => r.toString()).join(',')]);
    else
      return this.repo.query(`SELECT to_char((d.the_day AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') AS "day"
    , a.olimpiad
    , count(a.olimpiad) as value
    , array_agg(i.id) AS ids
FROM   generate_series($1, $2, interval    '1 day') d(the_day)
          CROSS  JOIN (SELECT DISTINCT id FROM events) AS i
          CROSS  JOIN LATERAL (
  SELECT olimpiad
  FROM   events a
  WHERE  a.id = i.id
    AND    a.start <  d.the_day + interval '1 day'
    AND   (a.finish   >= d.the_day OR a.finish IS NULL)
  ORDER  BY a.finish DESC
  LIMIT  1
  ) a
GROUP  BY d.the_day, a.olimpiad
ORDER  BY d.the_day, a.olimpiad`, [start, finish]);
  }
  // create(createOlimpiadDto: CreateOlimpiadDto): Promise<Olimpiad> {
  //   return this.olimpiadRepository.save(createOlimpiadDto);
  // }

  // findAll(): Promise<Olimpiad[]> {
  //   return this.olimpiadRepository.find();
  // }

  // findOne(id: number): Promise<Olimpiad> {
  //   return this.olimpiadRepository.findOneBy({ id });
  // }

  // update(id: number, updateOlimpiadDto: UpdateOlimpiadDto): Promise<UpdateOlimpiadDto> {
  //   return this.olimpiadRepository.update({id}, updateOlimpiadDto).then(result => {
  //     if (result.affected > 0) {
  //       return updateOlimpiadDto;
  //     } else
  //       return null;
  //   });
  // }

  // remove(id: number): Promise<boolean> {
  //   return this.olimpiadRepository.delete(id).then(result => {
  //     return result.affected > 0;
  //   });
  // }

  // async paginate(options: IPaginationOptions): Promise<Pagination<Olimpiad>> {
  //   return paginate<Olimpiad>(this.olimpiadRepository, options);
  // }
  // async paginate(searchOptions: options: IPaginationOptions): Promise<Pagination<Olimpiad>> {
  //   return paginate<Olimpiad>(this.olimpiadRepository, options);
  // }

}
