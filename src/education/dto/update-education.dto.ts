import { PartialType } from '@nestjs/swagger';
import { CreateEducationDto } from './create-education.dto';
import {IsDateString, IsISO8601, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateEducationDto extends PartialType(CreateEducationDto) {

    @IsString()
    @IsOptional()
    school: string

    @IsString()
    @IsOptional()
    qualification: string


    @IsString()
    @IsOptional()
    study: string


    @IsDateString({ strict: true } as any)
    @IsOptional()
    startDate: string


    @IsDateString({ strict: true } as any)
    @IsOptional()
    endDate: string

}
