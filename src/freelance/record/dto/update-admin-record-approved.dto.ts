import {IsBoolean, IsNotEmpty} from "class-validator";

export class UpdateAdminRecordApprovedDto {

    @IsNotEmpty()
    @IsBoolean()
    isApproved: number;


}
