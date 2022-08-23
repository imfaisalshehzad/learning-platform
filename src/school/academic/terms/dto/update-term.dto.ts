import { PartialType } from '@nestjs/swagger';
import { CreateTermDto } from './create-term.dto';
import {IsOptional, IsString} from "class-validator";

export class UpdateTermDto extends PartialType(CreateTermDto) {

    @IsString()
    @IsOptional()
    name: string



}
