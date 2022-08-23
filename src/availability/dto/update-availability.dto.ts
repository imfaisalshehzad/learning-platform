import { PartialType } from '@nestjs/swagger';
import { CreateAvailabilityDto } from './create-availability.dto';
import {IsMilitaryTime, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateAvailabilityDto extends PartialType(CreateAvailabilityDto) {

    @IsString()
    @IsOptional()
    day: string;

    @IsMilitaryTime({
        message: "value must be a valid representation of time in the format HH:MM"
    })
    @IsOptional()
    start_time: string

    @IsMilitaryTime()
    @IsOptional()
    end_time: string


}
