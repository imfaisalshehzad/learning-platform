import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Req,
    UseGuards,
    UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import {BlocksService} from './blocks.service';
import {CreateBlockDto} from './dto/create-block.dto';
import {UpdateBlockDto} from './dto/update-block.dto';
import {PaginationParams} from "../../../../utils/types/paginationParams";
import RequestWithUser from "../../../../authentication/requestWithUser.interface";
import RoleGuard from "../../../../authentication/role.guard";
import {RoleEnum} from "../../../../authentication/role.enum";
import JwtAuthenticationGuard from "../../../../authentication/jwt-authentication.guard";
import {CloneBlockDto} from "./dto/clone-block.dto";
import {FindOneParams} from "../../../../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Timetable Blocks')
@Controller('blocks')
@UseInterceptors(ClassSerializerInterceptor)
export class BlocksController {
    constructor(private readonly blocksService: BlocksService) {
    }

    @Post()
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createBlockDto: CreateBlockDto, @Req() req: RequestWithUser) {
        return this.blocksService.create(createBlockDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query()  {
        offset,
        limit,
        page,
        sort_order,
        order_by,
        timetable,
        from,
        to
    }: PaginationParams, @Req() req: RequestWithUser) {
        return this.blocksService.findAll(req.user, offset, limit, page, sort_order, order_by, timetable, from, to);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams) {
        return this.blocksService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateBlockDto: UpdateBlockDto) {
        return this.blocksService.update(+id, updateBlockDto);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams) {
        return this.blocksService.remove(+id);
    }


    @Post('clone')
    @UseGuards(RoleGuard(RoleEnum.SCHOOL))
    @UseGuards(JwtAuthenticationGuard)
    clone(@Body() cloneBlockDto: CloneBlockDto) {
        return this.blocksService.clone(cloneBlockDto);
    }
}
