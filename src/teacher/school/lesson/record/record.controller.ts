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
import {SchoolRecordSessionService} from './record.service';
import {CreateSchoolRecordDto} from './dto/create-record.dto';
import {UpdateSchoolRecordDto} from './dto/update-record.dto';
import RoleGuard from "../../../../authentication/role.guard";
import {ProfileEnum, RoleEnum} from "../../../../authentication/role.enum";
import JwtAuthenticationGuard from "../../../../authentication/jwt-authentication.guard";
import {FindOneParams} from "../../../../utils/findOneParams";
import RequestWithUser from "../../../../authentication/requestWithUser.interface";
import {PaginationParams} from "../../../../utils/types/paginationParams";
import ProfileRoleGuard from "../../../../authentication/profile.decorator";

@Controller('school/record')
@UseInterceptors(ClassSerializerInterceptor)
export class SchoolRecordSessionController {
    constructor(private readonly recordService: SchoolRecordSessionService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createRecordDto: CreateSchoolRecordDto, @Req() req: RequestWithUser) {
        return this.recordService.create(createRecordDto, req.user);
    }

    @Get()
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query() {
        offset,
        limit,
        page,
        order_by,
        sort_order,
        from,
        to,
        subject
    }: PaginationParams, @Req() req: RequestWithUser) {
        return this.recordService.findAll(req.user, offset, limit, page, order_by, sort_order, from, to, subject);
    }

    @Get(':id')
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.recordService.findOne(+id, req.user);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateRecordDto: UpdateSchoolRecordDto, @Req() req: RequestWithUser) {
        return this.recordService.update(+id, updateRecordDto, req.user);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.recordService.remove(+id, req.user);
    }
}
