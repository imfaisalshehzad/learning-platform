import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor, UseGuards
} from '@nestjs/common';
import {ChallengeService} from './challenge.service';
import {CreateChallengeDto} from './dto/create-challenge.dto';
import {UpdateChallengeDto} from './dto/update-challenge.dto';
import RoleGuard from "../../authentication/role.guard";
import {RoleEnum} from "../../authentication/role.enum";
import JwtAuthenticationGuard from "../../authentication/jwt-authentication.guard";
import {FindOneParams} from "../../utils/findOneParams";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";


@ApiBearerAuth()
@ApiTags('Challenge')
@Controller('challenge')
@UseInterceptors(ClassSerializerInterceptor)
export class ChallengeController {
    constructor(private readonly challengeService: ChallengeService) {}

    @Post()
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    create(@Body() createChallengeDto: CreateChallengeDto) {
        return this.challengeService.create(createChallengeDto);
    }

    @Get()
    findAll() {
        return this.challengeService.findAll();
    }

    @Get(':id')
    findOne(@Param() {id}: FindOneParams) {
        return this.challengeService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    update(@Param() {id}: FindOneParams, @Body() updateChallengeDto: UpdateChallengeDto) {
        return this.challengeService.update(+id, updateChallengeDto);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(RoleEnum.TEACHER))
    @UseGuards(JwtAuthenticationGuard)
    remove(@Param() {id}: FindOneParams) {
        return this.challengeService.remove(+id);
    }
}
