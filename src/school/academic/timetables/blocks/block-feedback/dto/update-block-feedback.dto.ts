import { PartialType } from '@nestjs/swagger';
import { CreateBlockFeedbackDto } from './create-block-feedback.dto';
import {IsArray, IsEnum, IsObject, IsOptional, IsString} from "class-validator";
import {FEEDBACK_ENUM, REGISTER_ATTENDANCE_ENUM} from "../../../../../../utils/enum/enum.types";

export class UpdateBlockFeedbackDto extends PartialType(CreateBlockFeedbackDto) {

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

    @IsOptional()
    @IsObject()
    blocks: object

    @IsOptional()
    @IsArray()
    student: object[]

}
