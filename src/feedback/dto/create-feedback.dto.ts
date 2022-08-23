import {IsArray, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";
import {FEEDBACK_ENUM} from "../../utils/enum/enum.types";

export class CreateFeedbackDto {

    @IsNotEmpty()
    @IsString()
    comment: string

    @IsNotEmpty()
    @IsEnum(FEEDBACK_ENUM, {
        message: `status value should be ` + Object.values(FEEDBACK_ENUM).join(', ')
    })
    status: FEEDBACK_ENUM

    @IsOptional()
    @IsObject()
    subject: object

    @IsOptional()
    @IsObject()
    classGroup: object

    @IsNotEmpty()
    @IsArray()
    student: object[]

}
