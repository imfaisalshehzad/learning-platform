import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ClassSerializerInterceptor,
    UseInterceptors, UseGuards, Req, Query
} from '@nestjs/common';
import {HomeworkService} from './homework.service';
import {CreateHomeworkDto} from './dto/create-homework.dto';
import {UpdateHomeworkDto} from './dto/update-homework.dto';
import RoleGuard from "../authentication/role.guard";
import {ProfileEnum, RoleEnum} from "../authentication/role.enum";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RequestWithUser from "../authentication/requestWithUser.interface";
import {FindOneParams} from "../utils/findOneParams";
import {PaginationParams} from "../utils/types/paginationParams";
import {SubmitHomeworkDto} from "./dto/submit/submit-homework.dto";
import {MarkHomeworkDto} from "./dto/mark/mark-homework.dto";
import ProfileRoleGuard from "../authentication/profile.decorator";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Homework')
@Controller('homework')
@UseInterceptors(ClassSerializerInterceptor)
export class HomeworkController {
    constructor(private readonly homeworkService: HomeworkService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createHomeworkDto: CreateHomeworkDto, @Req() req: RequestWithUser) {
        return this.homeworkService.create(createHomeworkDto, req.user);
    }

    @Get()
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    findAll(
        @Query() {offset, limit, page, sort_order, order_by, from, to}: PaginationParams,
        @Req() req: RequestWithUser,
    ) {
        return this.homeworkService.findAll(req.user, offset, limit, page, sort_order, order_by, from, to);
    }

    @Get(':id')
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.homeworkService.findOne(+id, req.user);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateHomeworkDto: UpdateHomeworkDto, @Req() req: RequestWithUser) {
        return this.homeworkService.update(+id, updateHomeworkDto, req.user);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.homeworkService.remove(+id, req.user);
    }

    @Post('student/submit')
    @UseGuards(RoleGuard(RoleEnum.STUDENT))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    homeworkSubmit(@Body() submitHomeworkDto: SubmitHomeworkDto, @Req() req: RequestWithUser){
        return this.homeworkService.homeworkSubmit(submitHomeworkDto, req.user)
    }


    @Post('teacher/mark')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    homeworkMark(@Body() markHomeworkDto: MarkHomeworkDto, @Req() req: RequestWithUser){
        return this.homeworkService.homeworkMark(markHomeworkDto, req.user)
    }


}
