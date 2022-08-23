import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Query,
    UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import {SubjectsService} from './subjects.service';
import {CreateSubjectDto} from './dto/create-subject.dto';
import {UpdateSubjectDto} from './dto/update-subject.dto';
import RoleGuard from "../../../authentication/role.guard";
import {RoleEnum} from "../../../authentication/role.enum";
import JwtAuthenticationGuard from "../../../authentication/jwt-authentication.guard";
import RequestWithUser from "../../../authentication/requestWithUser.interface";
import {PaginationParams} from "../../../utils/types/paginationParams";
import {FindOneParams} from "../../../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Subjects')
@Controller('subjects')
@UseInterceptors(ClassSerializerInterceptor)
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createSubjectDto: CreateSubjectDto, @Req() req: RequestWithUser) {
        return this.subjectsService.create(createSubjectDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query()  {offset, limit, page, sort_order, order_by}: PaginationParams, @Req() req: RequestWithUser) {
        return this.subjectsService.findAll(req.user, offset, limit, page, sort_order, order_by);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams) {
        return this.subjectsService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateSubjectDto: UpdateSubjectDto, @Req() req: RequestWithUser) {
        return this.subjectsService.update(+id, updateSubjectDto, req.user);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.subjectsService.remove(+id);
    }
}
