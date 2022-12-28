import {ApiProperty} from "@nestjs/swagger";

export class CreateOlimpiadDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    url: string;
    @ApiProperty()
    rating: number;
    @ApiProperty()
    level: number;
}
