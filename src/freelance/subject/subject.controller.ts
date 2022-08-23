import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
    Query,
    UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import {FreelanceSubjectService} from './subject.service';
import {CreateSubjectDto} from './dto/create-subject.dto';
import {UpdateSubjectDto} from './dto/update-subject.dto';
import RequestWithUser from "../../authentication/requestWithUser.interface";
import JwtAuthenticationGuard from "../../authentication/jwt-authentication.guard";
import {FindOneParams} from "../../utils/findOneParams";
import {PaginationParams} from "../../utils/types/paginationParams";
import RoleGuard from "../../authentication/role.guard";
import {RoleEnum} from "../../authentication/role.enum";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Freelance Subject')
@Controller('subject')
@UseInterceptors(ClassSerializerInterceptor)
export class FreelanceSubjectController {
    constructor(private readonly subjectService: FreelanceSubjectService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.ADMIN))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createSubjectDto: CreateSubjectDto, @Req() req: RequestWithUser) {
        return this.subjectService.create(createSubjectDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query() {offset, limit, page, sort_order, order_by}: PaginationParams, @Req() req: RequestWithUser) {
        return this.subjectService.findAll(req.user, offset, limit, page, sort_order, order_by);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.subjectService.findOne(+id, req.user);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.ADMIN))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateSubjectDto: UpdateSubjectDto, @Req() req: RequestWithUser) {
        return this.subjectService.update(+id, updateSubjectDto, req.user);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.ADMIN))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.subjectService.remove(+id, req.user);
    }


}
