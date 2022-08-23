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
import {TimetableBlockFeedbackService} from './block-feedback.service';
import {CreateBlockFeedbackDto} from './dto/create-block-feedback.dto';
import {UpdateBlockFeedbackDto} from './dto/update-block-feedback.dto';
import RoleGuard from "../../../../../authentication/role.guard";
import {ProfileEnum, RoleEnum} from "../../../../../authentication/role.enum";
import JwtAuthenticationGuard from "../../../../../authentication/jwt-authentication.guard";
import RequestWithUser from "../../../../../authentication/requestWithUser.interface";
import {FindOneParams} from "../../../../../utils/findOneParams";
import {PaginationParams} from "../../../../../utils/types/paginationParams";
import ProfileRoleGuard from "../../../../../authentication/profile.decorator";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Timetable Register')
@Controller('register')
@UseInterceptors(ClassSerializerInterceptor)
export class TimetableBlockFeedbackController {
    constructor(private readonly blockFeedbackService: TimetableBlockFeedbackService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createBlockFeedbackDto: CreateBlockFeedbackDto, @Req() req: RequestWithUser) {
        return this.blockFeedbackService.create(createBlockFeedbackDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query()  {
        offset,
        limit,
        page,
        sort_order,
        order_by,
        status,
    }: PaginationParams, @Req() req: RequestWithUser) {
        return this.blockFeedbackService.findAll(req.user, offset, limit, page, sort_order, order_by, status);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams) {
        return this.blockFeedbackService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateBlockFeedbackDto: UpdateBlockFeedbackDto, @Req() req: RequestWithUser) {
        return this.blockFeedbackService.update(+id, updateBlockFeedbackDto);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.blockFeedbackService.remove(+id);
    }
}
