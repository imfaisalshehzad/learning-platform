import {IsArray, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";
import {FEEDBACK_ENUM, REGISTER_ATTENDANCE_ENUM} from "../../../../../../utils/enum/enum.types";

export class CreateBlockFeedbackDto {

    @IsOptional()
    @IsString()
    comment: string

    @IsOptional()
    @IsString()
    @IsEnum(FEEDBACK_ENUM, {
        message: `status value should be ` + Object.values(FEEDBACK_ENUM).join(', ')
    })
    status: FEEDBACK_ENUM

    @IsOptional()
    @IsString()
    @IsEnum(REGISTER_ATTENDANCE_ENUM, {
        message: `attendance value should be ` + Object.values(REGISTER_ATTENDANCE_ENUM).join(', ')
    })
    attendance: REGISTER_ATTENDANCE_ENUM

    @IsNotEmpty()
    @IsObject()
    blocks: object

    @IsNotEmpty()
    @IsArray()
    student: object[]


}
