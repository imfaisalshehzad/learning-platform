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
import {FeedbackService} from './feedback.service';
import {CreateFeedbackDto} from './dto/create-feedback.dto';
import {UpdateFeedbackDto} from './dto/update-feedback.dto';
import RoleGuard from "../authentication/role.guard";
import {ProfileEnum, RoleEnum} from "../authentication/role.enum";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RequestWithUser from "../authentication/requestWithUser.interface";
import {FindOneParams} from "../utils/findOneParams";
import {PaginationParams} from "../utils/types/paginationParams";
import ProfileRoleGuard from "../authentication/profile.decorator";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags('Feedback')
@Controller('feedback')
@UseInterceptors(ClassSerializerInterceptor)
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createFeedbackDto: CreateFeedbackDto, @Req() req: RequestWithUser) {
        return this.feedbackService.create(createFeedbackDto, req.user);
    }

    @Get()
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    findAll(
        @Query() {offset, limit, page, status}: PaginationParams,
        @Req() req: RequestWithUser
    ) {
        return this.feedbackService.findAll(req.user, offset, limit, page, status);
    }

    @Get(':id')
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams) {
        return this.feedbackService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateFeedbackDto: UpdateFeedbackDto, @Req() req: RequestWithUser) {
        return this.feedbackService.update(+id, updateFeedbackDto, req.user);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(ProfileRoleGuard(ProfileEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.feedbackService.remove(+id, req.user);
    }
}
