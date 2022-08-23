import {
    IsArray, IsEnum, IsNotEmpty, IsString,
} from "class-validator";
import {FileSystemStoredFile, HasMimeType, IsFiles, MaxFileSize} from "nestjs-form-data";
import {PROFILE_TYPE, SESSION_TYPE, UPLOAD_TYPE} from "../entities/upload.entity";

export class CreateUploadDto {

    @IsArray()
    @IsFiles()
    @MaxFileSize(5e6,{
        each: true,
        message: "Maximum file size is 5MB"
    })
    @HasMimeType([
        'image/jpg',
        'image/jpeg',

        'image/png',
        'application/pdf'
    ],{each: true})
    asset: FileSystemStoredFile[]

    @IsNotEmpty()
    @IsString()
    @IsEnum(UPLOAD_TYPE,{
        message: "Type value should be either RESOURCES or COVER_IMAGE."
    })
    type: UPLOAD_TYPE

    @IsNotEmpty()
    @IsString()
    @IsEnum(SESSION_TYPE,{
        message: "Session value should be either RECORDED or LIVE."
    })
    session: SESSION_TYPE

    @IsNotEmpty()
    @IsString()
    @IsEnum(PROFILE_TYPE,{
        message: "Profile value should be either FREELANCE or SCHOOL."
    })
    profile: PROFILE_TYPE


}
