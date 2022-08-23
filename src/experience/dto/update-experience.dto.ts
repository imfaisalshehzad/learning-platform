import { PartialType } from '@nestjs/swagger';
import { CreateExperienceDto } from './create-experience.dto';
import {IsDate, IsDateString, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {

    @IsString()
    @IsOptional()
    workplace: string

    @IsString()
    @IsOptional()
    position: string


    @IsString()
    @IsOptional()
    department: string

    @IsString()
    @IsOptional()
    description: string


    @IsDateString()
    @IsOptional()
    startDate: string;


    @IsDateString()
    @IsISO8601()
    @IsOptional()
    endDate: string

}
