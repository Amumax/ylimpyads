import {ApiProperty} from "@nestjs/swagger";

export class CreateHostDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    region?: string;
    @ApiProperty()
    city?: string;
    @ApiProperty()
    address?: string;
    @ApiProperty()
    phone?: string;
    @ApiProperty()
    url?: string;
    @ApiProperty()
    email?: string;
    @ApiProperty()
    official_name?: string;
}
