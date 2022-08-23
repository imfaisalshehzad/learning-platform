import { PartialType } from '@nestjs/swagger';
import { CreateRecordDto } from './create-record.dto';
import {IsArray, IsDecimal, IsOptional, IsString} from "class-validator";

export class UpdateRecordDto extends PartialType(CreateRecordDto) {

    @IsString()
    @IsOptional()
    name: string

    @IsDecimal()
    @IsOptional()
    price: number

    @IsString()
    @IsOptional()
    description: string

    @IsArray()
    @IsOptional()
    tags: object[]

    @IsString()
    @IsOptional()
    image: string

    @IsArray()
    @IsOptional()
    subjects: object[]

    @IsArray()
    @IsOptional()
    resource: object[]

}
