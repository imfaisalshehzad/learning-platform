import {PartialType} from '@nestjs/swagger';
import {CreateDaysOffDto} from './create-daysoff.dto';
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateDaysOffDto extends PartialType(CreateDaysOffDto) {

    @IsString()
    @IsOptional()
    public date: string
}
