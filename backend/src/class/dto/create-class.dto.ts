import {ApiProperty} from "@nestjs/swagger";

export class CreateClassDto {
    @ApiProperty()
    name: string;
}
