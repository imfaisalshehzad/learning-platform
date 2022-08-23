import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor, UseGuards, Req, Query
} from '@nestjs/common';
import {SchoolLiveService} from './live.service';
import {CreateLiveDto} from './dto/create-live.dto';
import {UpdateLiveDto} from './dto/update-live.dto';
import RoleGuard from "../../../../authentication/role.guard";
import {ProfileEnum, RoleEnum} from "../../../../authentication/role.enum";
import JwtAuthenticationGuard from "../../../../authentication/jwt-authentication.guard";
import RequestWithUser from "../../../../authentication/requestWithUser.interface";
import {PaginationParams} from "../../../../utils/types/paginationParams";
import {FindOneParams} from "../../../../utils/findOneParams";
import ProfileRoleGuard from "../../../../authentication/profile.decorator";

@Controller('school/live')
@UseInterceptors(ClassSerializerInterceptor)
export class SchoolLiveController {
    constructor(private readonly liveSchoolService: SchoolLiveService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createLiveDto: CreateLiveDto, @Req() req: RequestWithUser) {
        return this.liveSchoolService.create(createLiveDto, req.user);
    }

    @Get()
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    findAll(
        @Query() {offset, limit, page, order_by, sort_order, from, to, subject}: PaginationParams,
        @Req() req: RequestWithUser
    ) {
        return this.liveSchoolService.findAll(req.user, offset, limit, page, order_by, sort_order, from, to, subject);
    }

    @Get(':id')
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams) {
        return this.liveSchoolService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateLiveDto: UpdateLiveDto, @Req() req: RequestWithUser) {
        return this.liveSchoolService.update(+id, updateLiveDto, req.user);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.liveSchoolService.remove(+id, req.user);
    }
}
