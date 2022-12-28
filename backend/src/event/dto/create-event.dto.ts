import {ApiProperty} from "@nestjs/swagger";

export class CreateEventDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    start?: Date;
    @ApiProperty()
    finish?: Date;
}
