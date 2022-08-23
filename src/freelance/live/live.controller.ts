import {
    Body, ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {LiveService} from './live.service';
import {CreateLiveDto} from './dto/create-live.dto';
import {UpdateLiveDto} from './dto/update-live.dto';
import JwtAuthenticationGuard from "../../authentication/jwt-authentication.guard";
import {FindOneParams} from "../../utils/findOneParams";
import RequestWithUser from "../../authentication/requestWithUser.interface";
import {PaginationParams} from "../../utils/types/paginationParams";
import RoleGuard from "../../authentication/role.guard";
import {RoleEnum} from "../../authentication/role.enum";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Freelance Live')
@Controller('live')
@UseInterceptors(ClassSerializerInterceptor)
export class LiveController {
    constructor(private readonly liveService: LiveService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createLiveDto: CreateLiveDto, @Req() req: RequestWithUser) {
        return this.liveService.create(createLiveDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(
        @Query() {
            offset,
            limit,
            page,
            order_by,
            sort_order,
            from,
            to,
            subject
        }: PaginationParams,
        @Req() req: RequestWithUser
    ) {
        return this.liveService.findAll(
            req.user,
            offset,
            limit,
            page,
            order_by,
            sort_order,
            from,
            to,
            subject,
        );
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.liveService.findOne(+id, req.user);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateLiveDto: UpdateLiveDto, @Req() req: RequestWithUser) {
        return this.liveService.update(+id, updateLiveDto, req.user);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.liveService.remove(+id, req.user);
    }
}
