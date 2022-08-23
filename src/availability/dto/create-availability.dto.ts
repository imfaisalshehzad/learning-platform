import {
    IsMilitaryTime,
    IsNotEmpty,
    IsString,
} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateAvailabilityDto {

    @ApiProperty({ required: true, description: 'day' })
    @IsString()
    @IsNotEmpty()
    day: string;

    @ApiProperty({ required: true, description: 'start_time' })
    @IsMilitaryTime({
        message: "value must be a valid representation of time in the format HH:MM"
    })
    @IsNotEmpty()
    start_time: string

    @ApiProperty({ required: true, description: 'end_time' })
    @IsMilitaryTime()
    @IsNotEmpty()
    end_time: string

}
