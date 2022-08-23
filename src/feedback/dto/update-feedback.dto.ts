import { PartialType } from '@nestjs/swagger';
import { CreateFeedbackDto } from './create-feedback.dto';
import {IsArray, IsEnum, IsObject, IsOptional, IsString} from "class-validator";
import {FEEDBACK_ENUM} from "../../utils/enum/enum.types";

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {

    @IsOptional()
    @IsString()
    comment: string

    @IsOptional()
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

    @IsOptional()
    @IsArray()
    student: object[]


}
