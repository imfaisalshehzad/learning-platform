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
import {RecordService} from './record.service';
import {CreateRecordDto} from './dto/create-record.dto';
import {UpdateRecordDto} from './dto/update-record.dto';
import JwtAuthenticationGuard from "../../authentication/jwt-authentication.guard";
import {FindOneParams} from "../../utils/findOneParams";
import RequestWithUser from "../../authentication/requestWithUser.interface";
import {PaginationParams} from "../../utils/types/paginationParams";
import RoleGuard from "../../authentication/role.guard";
import {RoleEnum} from "../../authentication/role.enum";
import {UpdateAdminRecordApprovedDto} from "./dto/update-admin-record-approved.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";



@ApiBearerAuth()
@ApiTags('Freelance Record')
@Controller('record')
@UseInterceptors(ClassSerializerInterceptor)
export class RecordController {
    constructor(private readonly recordService: RecordService) {
    }

    @Post()
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createRecordDto: CreateRecordDto, @Req() req: RequestWithUser) {
        return this.recordService.create(createRecordDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    findAll(@Query() {
        offset,
        limit,
        page,
        order_by,
        sort_order,
        from,
        to,
        subject,
        rating,
        price,
    }: PaginationParams, @Req() req: RequestWithUser) {
        return this.recordService.findAll(req.user, offset, limit, page, order_by, sort_order, from, to, subject, rating, price);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.recordService.findOne(+id, req.user);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateRecordDto: UpdateRecordDto, @Req() req: RequestWithUser) {
        return this.recordService.update(+id, updateRecordDto, req.user);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.recordService.remove(+id, req.user);
    }


    @Patch('approved/:id')
    @UseGuards(RoleGuard(RoleEnum.ADMIN))
    @UseGuards(JwtAuthenticationGuard)
    updateApproved(@Param() {id}: FindOneParams, @Body() updateAdminRecordApprovedDto: UpdateAdminRecordApprovedDto, @Req() req: RequestWithUser) {
        return this.recordService.updateApproved(+id, updateAdminRecordApprovedDto, req.user);
    }


}
