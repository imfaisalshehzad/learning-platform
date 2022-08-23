import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor, Req, UseGuards, Query
} from '@nestjs/common';
import {ClassGroupService} from './class-group.service';
import {CreateClassGroupDto} from './dto/create-class-group.dto';
import {UpdateClassGroupDto} from './dto/update-class-group.dto';
import RequestWithUser from "../../../authentication/requestWithUser.interface";
import RoleGuard from "../../../authentication/role.guard";
import {RoleEnum} from "../../../authentication/role.enum";
import JwtAuthenticationGuard from "../../../authentication/jwt-authentication.guard";
import {PaginationParams} from "../../../utils/types/paginationParams";
import {FindOneParams} from "../../../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Class Group')
@Controller('class-group')
@UseInterceptors(ClassSerializerInterceptor)
export class ClassGroupController {
    constructor(private readonly classGroupService: ClassGroupService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createClassGroupDto: CreateClassGroupDto, @Req() req: RequestWithUser) {
        return this.classGroupService.create(createClassGroupDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query()  {offset, limit, page, sort_order, order_by, from, to, subject}: PaginationParams, @Req() req: RequestWithUser) {
        return this.classGroupService.findAll(req.user, offset, limit, page, sort_order, order_by, from, to, subject);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(
        @Query()  {from, to}: PaginationParams,
        @Param() {id}: FindOneParams,
    ) {
        return this.classGroupService.findOne(
            +id,
            from,
            to,
        );
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateClassGroupDto: UpdateClassGroupDto, @Req() req: RequestWithUser) {
        return this.classGroupService.update(+id, updateClassGroupDto, req.user);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.classGroupService.remove(+id, req.user);
    }

}
