import {ApiProperty} from "@nestjs/swagger";

export class CreateMajorDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    code: string;
}
