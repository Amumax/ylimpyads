import { PartialType } from '@nestjs/swagger';
import { CreateOlimpiadDto } from './create-olimpiad.dto';

export class UpdateOlimpiadDto extends PartialType(CreateOlimpiadDto) {
}
