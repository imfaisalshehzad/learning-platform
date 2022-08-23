import {IsNumberString, IsOptional, IsString} from "class-validator";

export class FindOneParams{

    @IsNumberString()
    id: string;


}
