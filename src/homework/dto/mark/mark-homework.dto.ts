import {IsEnum, IsNotEmpty, IsObject, IsString} from "class-validator";
import {ENUM_ACTIVE} from "../../../utils/enum/enum.types";

export class MarkHomeworkDto {

    @IsString()
    @IsNotEmpty()
    teacherComment: string

    @IsEnum(ENUM_ACTIVE)
    @IsNotEmpty()
    status: ENUM_ACTIVE


    @IsObject()
    @IsNotEmpty()
    submissions: object




}
