import {ApiProperty} from "@nestjs/swagger";
import { Transform } from "class-transformer";
import moment from "moment";

export class ScheduleDto {
    @ApiProperty()
    day: string;
    @ApiProperty()
    olimps: string[];
    @ApiProperty()
    value: number;
}

export class ScheduleDetailedDto {
    @ApiProperty()
    day: string;
    @ApiProperty()
    olimpipad: number;
    @ApiProperty()
    value: number;
    @ApiProperty()
    ids: number[];
}

export class ScheduleDayDetailsDto {
    @ApiProperty()
    day: string;
    @ApiProperty()
    olimp: string;
    @ApiProperty()
    oid: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    finish: string;
    @ApiProperty()
    start: string;
}