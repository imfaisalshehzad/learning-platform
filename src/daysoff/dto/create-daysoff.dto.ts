import {IsDateString, IsNotEmpty, IsString} from "class-validator";

export class CreateDaysOffDto {

    @IsDateString()
    @IsNotEmpty()
    public date: string

}
