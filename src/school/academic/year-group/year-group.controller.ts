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
import {YearGroupService} from './year-group.service';
import {CreateYearGroupDto} from './dto/create-year-group.dto';
import {UpdateYearGroupDto} from './dto/update-year-group.dto';
import RoleGuard from "../../../authentication/role.guard";
import {RoleEnum} from "../../../authentication/role.enum";
import JwtAuthenticationGuard from "../../../authentication/jwt-authentication.guard";
import RequestWithUser from "../../../authentication/requestWithUser.interface";
import {PaginationParams} from "../../../utils/types/paginationParams";
import {FindOneParams} from "../../../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Year Group')
@Controller('playgroup')
@UseInterceptors(ClassSerializerInterceptor)
export class YearGroupController {
    constructor(private readonly yearGroupService: YearGroupService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createYearGroupDto: CreateYearGroupDto, @Req() req: RequestWithUser) {
        return this.yearGroupService.create(createYearGroupDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query()  {offset, limit, page, sort_order, order_by}: PaginationParams, @Req() req: RequestWithUser) {
        return this.yearGroupService.findAll(req.user, offset, limit, page, sort_order, order_by);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams) {
        return this.yearGroupService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateYearGroupDto: UpdateYearGroupDto, @Req() req: RequestWithUser) {
        return this.yearGroupService.update(+id, updateYearGroupDto, req.user);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.yearGroupService.remove(+id, req.user);
    }


}
