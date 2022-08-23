import {
    Controller,
    Get,
    Param,
    UseInterceptors,
    ClassSerializerInterceptor, Query, UseGuards, Req
} from '@nestjs/common';
import {AttendanceService} from './attendance.service';
import {PaginationParams} from "../../../utils/types/paginationParams";
import RoleGuard from "../../../authentication/role.guard";
import {RoleEnum} from "../../../authentication/role.enum";
import JwtAuthenticationGuard from "../../../authentication/jwt-authentication.guard";
import {FindOneParams} from "../../../utils/findOneParams";
import RequestWithUser from "../../../authentication/requestWithUser.interface";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Attendance')
@Controller('attendance')
@UseInterceptors(ClassSerializerInterceptor)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    @Get(':id')
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    findAll(
        @Query()  {from, to, role}: PaginationParams,
        @Param() {id}: FindOneParams,
        @Req() req: RequestWithUser
    ) {
        return this.attendanceService.findAll(req.user, +id, from, to, role);
    }

}
