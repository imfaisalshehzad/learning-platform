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
import {AvailabilityService} from './availability.service';
import {CreateAvailabilityDto} from './dto/create-availability.dto';
import {UpdateAvailabilityDto} from './dto/update-availability.dto';
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RequestWithUser from "../authentication/requestWithUser.interface";
import {FindOneParams} from "../utils/findOneParams";
import {PaginationParams} from "../utils/types/paginationParams";
import RoleGuard from "../authentication/role.guard";
import {RoleEnum} from "../authentication/role.enum";
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation, ApiParam,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger";
import {AvailabilityEntity} from "./entities/availability.entity";

@ApiBearerAuth()
@ApiTags('Availability')
@Controller('availability')
@UseInterceptors(ClassSerializerInterceptor)
export class AvailabilityController {
    constructor(private readonly availabilityService: AvailabilityService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Create Availability' })
    @ApiOkResponse({
        type: CreateAvailabilityDto,
        description: 'Create Availability'
    })
    @ApiNotFoundResponse()
    create(@Body() createAvailabilityDto: CreateAvailabilityDto, @Req() req: RequestWithUser) {
        return this.availabilityService.create(createAvailabilityDto, req.user);
    }

    @Get()
    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Find All Availability' })
    findAll(
        @Query() {offset, limit, page}: PaginationParams,
        @Req() req: RequestWithUser
    ) {
        return this.availabilityService.findAll(req.user, offset, limit, page);
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Find One Availability' })
    @ApiResponse({
        status: 200,
        description: 'Find One Availability',
        type: AvailabilityEntity,
    })
    @ApiParam({
        name: 'id',
        required: true,
    })
    findOne(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.availabilityService.findOne(+id, req.user);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Update One Availability' })
    @ApiOkResponse({
        type: CreateAvailabilityDto,
        description: 'Create Availability'
    })
    @ApiParam({
        name: 'id',
        required: true,
    })
    update(@Param() {id}: FindOneParams, @Body() updateAvailabilityDto: UpdateAvailabilityDto, @Req() req: RequestWithUser) {
        return this.availabilityService.update(+id, updateAvailabilityDto, req.user);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Delete One Availability' })
    @ApiParam({
        name: 'id',
        required: true,
    })
    remove(@Param() {id}: FindOneParams, @Req() req: RequestWithUser) {
        return this.availabilityService.remove(+id, req.user);
    }
}
