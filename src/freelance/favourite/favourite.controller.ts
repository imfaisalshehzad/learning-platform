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
    UseInterceptors,
    ClassSerializerInterceptor, Query
} from '@nestjs/common';
import {FavouriteService} from './favourite.service';
import {CreateFavouriteDto} from './dto/create-favourite.dto';
import {UpdateFavouriteDto} from './dto/update-favourite.dto';
import JwtAuthenticationGuard from "../../authentication/jwt-authentication.guard";
import RoleGuard from "../../authentication/role.guard";
import {RoleEnum} from "../../authentication/role.enum";
import RequestWithUser from "../../authentication/requestWithUser.interface";
import {FindOneParams} from "../../utils/findOneParams";
import {PaginationParams} from "../../utils/types/paginationParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Freelance Favourite')
@Controller('favourite')
@UseInterceptors(ClassSerializerInterceptor)
export class FavouriteController {
    constructor(private readonly favouriteService: FavouriteService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.STUDENT))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createFavouriteDto: CreateFavouriteDto, @Req() req: RequestWithUser) {
        return this.favouriteService.create(createFavouriteDto, req.user);
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
            status
        }: PaginationParams,
        @Req() req: RequestWithUser
    ) {
        return this.favouriteService.findAll(
            req.user,
            offset,
            limit,
            page,
            order_by,
            sort_order,
            from,
            to,
            status,
        );
    }

    @Get(':id')
    @UseGuards(JwtAuthenticationGuard)
    findOne(@Param() {id}: FindOneParams) {
        return this.favouriteService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.STUDENT))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateFavouriteDto: UpdateFavouriteDto, @Req() req: RequestWithUser) {
        return this.favouriteService.update(+id, updateFavouriteDto, req.user);
    }

}
