import { PartialType } from '@nestjs/swagger';
import { CreateTimetableDto } from './create-timetable.dto';
import {IsOptional, IsString} from "class-validator";

export class UpdateTimetableDto extends PartialType(CreateTimetableDto) {

    @IsString()
    @IsOptional()
    name: string

}
