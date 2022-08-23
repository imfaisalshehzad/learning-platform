import { PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create-subject.dto';
import {IsOptional, IsString} from "class-validator";

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {

    @IsString()
    @IsOptional()
    name: string;

}
