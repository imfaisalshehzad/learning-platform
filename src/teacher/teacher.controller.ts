import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Query,
    Req,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {TeacherService} from './teacher.service';
import {PaginationParams} from "../utils/types/paginationParams";
import {UpdateTeacherDto} from "./dto/update-teacher.dto";
import {FindOneParams} from "../utils/findOneParams";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RoleGuard from "../authentication/role.guard";
import {RoleEnum} from "../authentication/role.enum";
import RequestWithUser from "../authentication/requestWithUser.interface";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";




@ApiBearerAuth()
@ApiTags('Teacher')
@Controller('teacher')
@UseInterceptors(ClassSerializerInterceptor)
export class TeacherController {
    constructor(
        private readonly teacherService: TeacherService
    ) {}


    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query()  {offset, limit, page, sort_order, order_by, subject}: PaginationParams) {
        return this.teacherService.findAllTeachers(offset, limit, page, sort_order, order_by, subject);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams) {
        return this.teacherService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateTeacherDto: UpdateTeacherDto) {
        return this.teacherService.update(+id, updateTeacherDto);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.ADMIN))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams) {
        return this.teacherService.remove(+id);
    }


    @Get('freelance/your-day')
    @UseGuards(JwtAuthenticationGuard)
    freelanceYourDaySessions(
        @Query()  {offset, limit, page, sort_order, order_by}: PaginationParams,
        @Req() req: RequestWithUser) {
        return this.teacherService.getFreelanceYourDaySessions(req.user, offset, limit, page, sort_order, order_by);
    }

    @Get('freelance/calender')
    @UseGuards(JwtAuthenticationGuard)
    freelanceCalenderSessions(
        @Query()  {offset, limit, page, sort_order, order_by, from, to}: PaginationParams,
        @Req() req: RequestWithUser) {
        return this.teacherService.getFreelanceCalenderSessions(req.user, offset, limit, page, sort_order, order_by, from, to);
    }


}
