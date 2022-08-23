import {IsDateString, IsNotEmpty, IsString} from "class-validator";

export class CreateEducationDto {
    @IsString()
    @IsNotEmpty()
    school: string

    @IsString()
    @IsNotEmpty()
    qualification: string


    @IsString()
    @IsNotEmpty()
    study: string


    @IsDateString({ strict: true } as any)
    @IsNotEmpty()
    startDate: string


    @IsDateString({ strict: true } as any)
    @IsNotEmpty()
    endDate: string


}
